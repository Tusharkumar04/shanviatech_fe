const logger = require('../config/logger');
const config = require('../config/config');

const MSG91_OTP_URL = 'https://control.msg91.com/api/v5/otp';

/**
 * Deliver an OTP by SMS through MSG91.
 *
 * Uses the /api/v5/otp endpoint but passes our own `otp`, so MSG91 never
 * generates or validates a code — it is purely the delivery pipe. We keep
 * owning the lifecycle (hashing, expiry, attempt cap, cooldown), which is what
 * lets phone and email verification share one implementation, and keeps a
 * provider swap contained to this file. We never call MSG91's /otp/verify.
 *
 * Why not the flow API: MSG91 templates are approved per route. An OTP-route
 * template pushed through /api/v5/flow/ is accepted with {type:'success'} and
 * then silently never delivered — verified against this account. If you later
 * author a flow-route template, this file is the only thing that changes.
 *
 * Returns { sent: true } on acceptance, or { skipped: true } in non-production
 * when no auth key is configured (the OTP is logged instead, so the whole flow
 * is testable without an SMS account). Throws on a real delivery failure.
 */
const sendOtpSms = async ({ countryCode, phone, otp }) => {
  const { authKey, templateId } = config.msg91;
  const mobile = `${countryCode}${phone}`;

  if (!authKey || !templateId) {
    if (config.env === 'production') {
      throw new Error('MSG91_AUTHKEY / MSG91_TEMPLATE_ID are not configured; cannot send OTP SMS.');
    }
    logger.warn(`[sms] ⚠ MSG91 not configured — DEV ONLY: OTP for +${mobile} is ${otp}`);
    return { skipped: true };
  }

  const params = new URLSearchParams({
    template_id: templateId,
    mobile,
    otp: String(otp),
    authkey: authKey,
  });

  logger.info(`[sms] MSG91 OTP request -> template=${templateId} | to=+${mobile}`);

  let res;
  let raw;
  try {
    res = await fetch(`${MSG91_OTP_URL}?${params.toString()}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
    });
    raw = await res.text();
  } catch (err) {
    logger.error(`[sms] ❌ MSG91 request failed: ${err.message || err}`);
    throw new Error('Could not reach the SMS provider. Please try again.');
  }

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    body = raw;
  }

  // MSG91 answers 200 with {type:'error'} for bad numbers/templates, so the
  // HTTP status alone doesn't tell us whether the SMS was accepted.
  if (!res.ok || (body && typeof body === 'object' && body.type === 'error')) {
    const reason = (body && body.message) || raw;
    logger.error(`[sms] ❌ MSG91 rejected (HTTP ${res.status}): ${raw}`);
    throw new Error(typeof reason === 'string' ? reason : 'Failed to send OTP SMS.');
  }

  logger.info(
    `[sms] ✅ OTP SMS accepted by MSG91 for +${mobile} (request_id: ${body?.request_id || 'n/a'})`
  );
  return { sent: true, body };
};

module.exports = { sendOtpSms };
