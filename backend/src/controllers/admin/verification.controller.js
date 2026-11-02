const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const verificationService = require('../../services/verification.service');

// ===== Public (popup) — reference response envelope {errorCode, statusCode, message, details} =====
// Always HTTP 200; the popup branches on errorCode, matching the survey endpoints.

const sendOtp = catchAsync(async (req, res) => {
  const result = await verificationService.sendOtp(req.body);
  res.status(httpStatus.OK).send(result);
});

// Resend is the same operation — sendOtp already updates the record in place
// and enforces the cooldown. Separate route purely so the popup reads clearly.
const resendOtp = sendOtp;

const verifyOtp = catchAsync(async (req, res) => {
  const result = await verificationService.verifyOtp(req.body);
  res.status(httpStatus.OK).send(result);
});

const getStatus = catchAsync(async (req, res) => {
  const result = await verificationService.getStatus(req.query.uid);
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  sendOtp,
  resendOtp,
  verifyOtp,
  getStatus,
};
