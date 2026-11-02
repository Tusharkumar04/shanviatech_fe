const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const { otpSendLimiter, otpVerifyLimiter } = require('../../../middlewares/rateLimiter');
const reachValidation = require('../../../validations/reach.validation');
const verificationValidation = require('../../../validations/verification.validation');
const reachController = require('../../../controllers/admin/reach.controller');

// Public OTP verification for the Reach Us contact form.
router.post('/send-otp', otpSendLimiter, validate(verificationValidation.sendOtp), reachController.sendOtp);
router.post('/verify-otp', otpVerifyLimiter, validate(verificationValidation.verifyOtp), reachController.verifyOtp);

router.post('/', validate(reachValidation.createReach), reachController.createReach);
router.put('/:reachId', validate(reachValidation.updateReach), reachController.updateReach);
router.delete('/:reachId', validate(reachValidation.deleteReach), reachController.deleteReach);
router.get('/details/:reachId?', validate(reachValidation.getReachDetails), reachController.getReachDetails);
router.get('/list', validate(reachValidation.getReachList), reachController.getReachList);

module.exports = router;
