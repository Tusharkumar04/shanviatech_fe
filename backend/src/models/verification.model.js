const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * One record per (uid, channel, target) — i.e. per contact a popup visitor is
 * trying to prove they own. The OTP itself is never stored in the clear.
 *
 * Lifecycle: created `pending` with a 10-minute OTP window and a TTL that
 * reaps it shortly after; on success it flips to `verified` and the TTL is
 * pushed out so `createOrUpdate` can still see the proof when the visitor
 * finishes the survey.
 */
const verificationSchema = mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    channel: {
      type: String,
      enum: ['email', 'phone'],
      required: true,
    },
    // Normalized form of the contact — lowercased email, or national-digits
    // phone. Always write via verification.service's normalizeTarget so that
    // send / verify / the submit-time check all agree on the key.
    target: {
      type: String,
      required: true,
    },
    // Phone only. Kept apart from `target` because it's needed to dial out but
    // must not affect matching (the visitor may or may not type it in the form).
    country_code: {
      type: String,
    },
    otp_hash: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'verified'],
      default: 'pending',
    },
    attempts: {
      type: Number,
      default: 0,
    },
    last_sent_at: {
      type: Date,
    },
    otp_expires_at: {
      type: Date,
    },
    expires_at: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// A visitor gets exactly one live record per contact — resending updates it in
// place rather than piling up rows we'd have to disambiguate at verify time.
verificationSchema.index({ uid: 1, channel: 1, target: 1 }, { unique: true });

// Mongo reaps the document once expires_at passes, so neither pending OTPs nor
// stale proofs accumulate. Runs on a ~60s sweep, so treat it as cleanup only —
// the service still checks otp_expires_at itself before accepting a code.
verificationSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

verificationSchema.methods.isOtpMatch = async function (otp) {
  if (!this.otp_hash) return false;
  return bcrypt.compare(String(otp), this.otp_hash);
};

const Verification = mongoose.model('Verification', verificationSchema);

module.exports = Verification;
