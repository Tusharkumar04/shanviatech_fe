const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const { otpSendLimiter, otpVerifyLimiter } = require('../../../middlewares/rateLimiter');
const verificationValidation = require('../../../validations/verification.validation');
const verificationController = require('../../../controllers/admin/verification.controller');

// Public (popup) — OTP verification for the survey form's email / phone fields.
router.post('/send', otpSendLimiter, validate(verificationValidation.sendOtp), verificationController.sendOtp);
router.post('/resend', otpSendLimiter, validate(verificationValidation.resendOtp), verificationController.resendOtp);
router.post('/verify', otpVerifyLimiter, validate(verificationValidation.verifyOtp), verificationController.verifyOtp);
router.get('/status', validate(verificationValidation.getStatus), verificationController.getStatus);

module.exports = router;
