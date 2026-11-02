const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const logger = require('../config/logger');
const config = require('../config/config');
const VerificationModel = require('../models/verification.model');
const { sendOtpSms } = require('./sms.service');
const { sendMail } = require('../utils/mail');
const { generateOtpEmail } = require('../utils/otpEmail');

const { length, expiryMinutes, maxAttempts, resendCooldownSeconds, proofTtlHours } = config.otp;

// ===== Helpers =====

/** Cryptographically secure OTP — Math.random() is predictable and unfit here. */
const generateOtp = () => {
  const max = 10 ** length;
  return String(crypto.randomInt(0, max)).padStart(length, '0');
};

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

/**
 * Reduce a phone number to the digits a human would recognise as "their
 * number", dropping any country code. The form and the verify step often
 * disagree about the +91 prefix, so matching on the national part keeps them
 * in sync. Numbers shorter than 10 digits are kept whole.
 *
 * Trade-off: this assumes 10-digit national numbers (correct for India, which
 * is what MSG91 serves). Supporting other countries means matching on
 * country_code + target instead.
 */
const normalizePhone = (value) => {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
};

const normalizeTarget = (channel, value) =>
  channel === 'email' ? normalizeEmail(value) : normalizePhone(value);

const normalizeCountryCode = (value) => {
  const digits = String(value || '').replace(/\D/g, '');
  return digits || config.msg91.defaultCountryCode;
};

const minutesFromNow = (mins) => new Date(Date.now() + mins * 60 * 1000);
const hoursFromNow = (hrs) => new Date(Date.now() + hrs * 60 * 60 * 1000);

/** Popup-facing envelope, matching the other public survey endpoints. */
const ok = (message, details) => ({ errorCode: 0, statusCode: 200, message, details });
const fail = (message, statusCode = 400, details) => ({ errorCode: 1, statusCode, message, details });

// ===== Send / resend =====

/**
 * Generate an OTP for a contact and deliver it over the requested channel.
 * Also serves resend — the record is updated in place and the cooldown applies
 * either way, so a visitor spamming "send" can't spam their own inbox.
 */
const sendOtp = async ({ uid, channel, target, country_code }) => {
  const normalized = normalizeTarget(channel, target);
  if (!normalized) {
    return fail(channel === 'email' ? 'A valid email address is required.' : 'A valid phone number is required.');
  }

  let record = await VerificationModel.findOne({ uid, channel, target: normalized });

  if (record && record.status === 'verified') {
    return ok('This contact is already verified.', { channel, target: normalized, status: 'verified' });
  }

  // Cooldown is enforced before we generate anything, so a blocked request
  // leaves the outstanding OTP untouched and still usable.
  if (record && record.last_sent_at) {
    const elapsed = (Date.now() - record.last_sent_at.getTime()) / 1000;
    if (elapsed < resendCooldownSeconds) {
      const retryAfter = Math.ceil(resendCooldownSeconds - elapsed);
      return fail(`Please wait ${retryAfter} second${retryAfter === 1 ? '' : 's'} before requesting another code.`, 429, {
        retry_after_seconds: retryAfter,
      });
    }
  }

  const otp = generateOtp();
  console.log(`Generated OTP for ${channel} ${normalized}: ${otp}`);
  const otpHash = await bcrypt.hash(otp, 8);
  const countryCode = channel === 'phone' ? normalizeCountryCode(country_code) : undefined;

  // Deliver first, persist second: if the provider rejects the number we don't
  // want to have already burned the previous OTP or started the cooldown.
  try {
    if (channel === 'email') {
      const result = await sendMail(normalized, 'Your Shanvia Tech verification code', generateOtpEmail({ otp, expiryMinutes }));
      // sendMail never throws — it reports config/transport problems in-band.
      if (result && result.error) {
        logger.error(`[verification] Email OTP not delivered to ${normalized}: ${result.error}`);
        return fail('We could not send the verification email right now. Please try again shortly.', 502);
      }
      // Mirrors sms.service: unconfigured mail is fatal in production, but in
      // dev we log the code so the flow is testable without an SMTP account.
      if (result && result.skipped) {
        if (config.env === 'production') {
          logger.error(`[verification] Email OTP not delivered to ${normalized}: mail is not configured`);
          return fail('We could not send the verification email right now. Please try again shortly.', 502);
        }
        logger.warn(`[verification] ⚠ Mail not configured — DEV ONLY: OTP for ${normalized} is ${otp}`);
      }
    } else {
      await sendOtpSms({ countryCode, phone: normalized, otp });
    }
  } catch (err) {
    logger.error(`[verification] OTP send failed for ${channel} ${normalized}: ${err.message || err}`);
    return fail(err.message || 'We could not send the verification code right now. Please try again shortly.', 502);
  }

  if (!record) {
    record = new VerificationModel({ uid, channel, target: normalized });
  }
  record.otp_hash = otpHash;
  record.status = 'pending';
  record.attempts = 0;
  record.last_sent_at = new Date();
  record.otp_expires_at = minutesFromNow(expiryMinutes);
  // Outlive the OTP a little so a just-expired code reports "expired" rather
  // than vanishing and looking like it was never requested.
  record.expires_at = minutesFromNow(expiryMinutes + 5);
  if (countryCode) record.country_code = countryCode;

  await record.save();

  return ok(
    channel === 'email'
      ? 'Verification code sent to your email address.'
      : 'Verification code sent to your phone number.',
    {
      channel,
      target: normalized,
      status: 'pending',
      expires_in_seconds: expiryMinutes * 60,
      resend_available_in_seconds: resendCooldownSeconds,
    }
  );
};

// ===== Verify =====

const verifyOtp = async ({ uid, channel, target, otp }) => {
  const normalized = normalizeTarget(channel, target);
  const record = await VerificationModel.findOne({ uid, channel, target: normalized });

  if (!record) {
    return fail('No verification code was requested for this contact. Please request a new code.', 404);
  }

  if (record.status === 'verified') {
    return ok('This contact is already verified.', { channel, target: normalized, status: 'verified' });
  }

  if (!record.otp_hash || !record.otp_expires_at || record.otp_expires_at.getTime() < Date.now()) {
    return fail('This verification code has expired. Please request a new one.', 410);
  }

  if (record.attempts >= maxAttempts) {
    return fail('Too many incorrect attempts. Please request a new code.', 429);
  }

  const matched = await record.isOtpMatch(otp);

  if (!matched) {
    record.attempts += 1;
    const remaining = Math.max(maxAttempts - record.attempts, 0);
    // Burn the code once the cap is hit so a wrong guesser can't keep trying
    // against the same OTP by waiting out the window.
    if (remaining === 0) record.otp_hash = undefined;
    await record.save();

    return fail(
      remaining > 0
        ? `Incorrect code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
        : 'Too many incorrect attempts. Please request a new code.',
      400,
      { attempts_remaining: remaining }
    );
  }

  record.status = 'verified';
  record.otp_hash = undefined;
  record.otp_expires_at = undefined;
  record.attempts = 0;
  // The proof has to survive long enough for the visitor to finish the survey.
  record.expires_at = hoursFromNow(proofTtlHours);
  await record.save();

  return ok(
    channel === 'email' ? 'Email address verified successfully.' : 'Phone number verified successfully.',
    { channel, target: normalized, status: 'verified' }
  );
};

// ===== Status =====

/** Lets the popup rehydrate its verified badges after a page refresh. */
const getStatus = async (uid) => {
  const records = await VerificationModel.find({ uid, status: 'verified' }).select('channel target country_code updatedAt');

  return ok('Verification status fetched successfully.', {
    uid,
    verified: records.map((r) => ({
      channel: r.channel,
      target: r.target,
      country_code: r.country_code,
      verified_at: r.updatedAt,
    })),
  });
};

// ===== Submit-time check =====

/**
 * True when this uid has proven ownership of this exact contact. Bound to the
 * target, not just the uid — otherwise a visitor could verify a throwaway
 * address and then submit somebody else's.
 */
const isVerified = async ({ uid, channel, target }) => {
  const normalized = normalizeTarget(channel, target);
  if (!normalized) return false;

  const record = await VerificationModel.findOne({
    uid,
    channel,
    target: normalized,
    status: 'verified',
  });

  // The TTL sweep is lazy, so check the timestamp rather than trusting absence.
  return Boolean(record && record.expires_at.getTime() > Date.now());
};

module.exports = {
  sendOtp,
  verifyOtp,
  getStatus,
  isVerified,
  normalizeTarget,
};
