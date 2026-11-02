const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const JobModel = require('../models/job.model');
const { uploadOriginalFile } = require('../middlewares/localFileUpload.middleware');
const { normalizeMetaInformation } = require('./helpers/metaInformation.helper');
const { addBaseUrlToPublicPaths } = require('./helpers/fileUrl.helper');

const shouldUpload = (value) => Boolean(value && typeof value === 'object' && value.file);

const buildJobPayload = async (data) => {
  const payload = { ...data };

  if (shouldUpload(payload.image)) {
    const uploadedImage = await uploadOriginalFile(payload.image, 'job/image');
    if (!uploadedImage) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload job image');
    }
    payload.image = uploadedImage;
  }

  return normalizeMetaInformation(payload, 'job');
};

const createJob = async (data) => {
  const payload = await buildJobPayload(data);
  return JobModel.create(payload);
};

const updateJob = async (jobId, data) => {
  const payload = await buildJobPayload(data);
  const updatedJob = await JobModel.findByIdAndUpdate(jobId, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedJob) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
  }

  return updatedJob;
};

const getJobDetails = async (filter = {}) => {
  const job = await JobModel.findOne(filter);
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job details not found');
  }
  return addBaseUrlToPublicPaths(job);
};

const getJobList = async (filter = {}, options = {}) => {
  const page = Math.max(parseInt(options.page, 10) || 1, 1);
  const limit = Math.max(parseInt(options.limit, 10) || 10, 1);
  const sort = options.sort || 'order createdAt';
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    JobModel.find(filter).sort(sort).skip(skip).limit(limit),
    JobModel.countDocuments(filter),
  ]);

  return addBaseUrlToPublicPaths({
    items,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

const deleteJob = async (jobId) => {
  const deletedJob = await JobModel.findByIdAndDelete(jobId);
  if (!deletedJob) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
  }

  return deletedJob;
};

module.exports = {
  createJob,
  updateJob,
  deleteJob,
  getJobDetails,
  getJobList,
};
