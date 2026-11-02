const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const reachService = require('../../services/reach.service');
const verificationService = require('../../services/verification.service');

const buildFilter = (params = {}, query = {}) => {
  const filter = params.reachId ? { _id: params.reachId } : { ...query };
  if (filter.meta_slug) {
    filter['metaInformation.slug'] = filter.meta_slug;
    delete filter.meta_slug;
  }
  return filter;
};

const createReach = catchAsync(async (req, res) => {
  // Public submissions carry a uid; require the email to have been OTP-verified
  // before we store the enquiry. Admin-created records (no uid) skip the gate.
  if (req.body.uid) {
    const verified = await verificationService.isVerified({
      uid: req.body.uid,
      channel: 'email',
      target: req.body.email,
    });
    if (!verified) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Please verify your email address before submitting.');
    }
  }

  const { uid, ...payload } = req.body;
  const data = await reachService.createReach(payload);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Successfully created reach record',
    data,
  });
});

// ===== Public OTP verification for the Reach Us form =====
const sendOtp = catchAsync(async (req, res) => {
  const result = await verificationService.sendOtp(req.body);
  res.status(httpStatus.OK).send(result);
});

const verifyOtp = catchAsync(async (req, res) => {
  const result = await verificationService.verifyOtp(req.body);
  res.status(httpStatus.OK).send(result);
});

const updateReach = catchAsync(async (req, res) => {
  const data = await reachService.updateReach(req.params.reachId, req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully updated reach record',
    data,
  });
});

const deleteReach = catchAsync(async (req, res) => {
  const data = await reachService.deleteReach(req.params.reachId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully deleted reach record',
    data,
  });
});

const getReachDetails = catchAsync(async (req, res) => {
  const filter = buildFilter(req.params, req.query);
  const data = await reachService.getReachDetails(filter);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Reach details fetched successfully',
    data,
  });
});

const getReachList = catchAsync(async (req, res) => {
  const { page, limit, sort, ...queryFilter } = req.query;
  const filter = buildFilter({}, queryFilter);
  const data = await reachService.getReachList(filter, { page, limit, sort });
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Reach list fetched successfully',
    data,
  });
});

module.exports = {
  createReach,
  sendOtp,
  verifyOtp,
  updateReach,
  deleteReach,
  getReachDetails,
  getReachList,
};
