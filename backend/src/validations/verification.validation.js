const Joi = require('joi');

// `target` is loose on purpose — the service normalizes and the per-channel
// rules below do the real checking. Keeping one field for both channels means
// the popup can drive send/verify/resend with a single request shape.
const target = Joi.alternatives().conditional('channel', {
  is: 'email',
  then: Joi.string().email().required(),
  otherwise: Joi.string()
    .pattern(/^[0-9+\-()\s]{6,20}$/)
    .required()
    .messages({ 'string.pattern.base': '"target" must be a valid phone number' }),
});

const sendOtp = {
  body: Joi.object().keys({
    uid: Joi.string().required(),
    channel: Joi.string().valid('email', 'phone').required(),
    target,
    country_code: Joi.string()
      .pattern(/^\+?[0-9]{1,4}$/)
      .allow('', null)
      .messages({ 'string.pattern.base': '"country_code" must be 1-4 digits, optionally prefixed with +' }),
  }),
};

const verifyOtp = {
  body: Joi.object().keys({
    uid: Joi.string().required(),
    channel: Joi.string().valid('email', 'phone').required(),
    target,
    otp: Joi.string()
      .pattern(/^[0-9]{4,8}$/)
      .required()
      .messages({ 'string.pattern.base': '"otp" must be 4-8 digits' }),
  }),
};

const getStatus = {
  query: Joi.object().keys({
    uid: Joi.string().required(),
  }),
};

module.exports = {
  sendOtp,
  resendOtp: sendOtp,
  verifyOtp,
  getStatus,
};
