const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const JobApplicationModel = require('../models/jobApplication.model');
const { uploadOriginalFile } = require('../middlewares/localFileUpload.middleware');
const { normalizeMetaInformation } = require('./helpers/metaInformation.helper');
const { addBaseUrlToPublicPaths } = require('./helpers/fileUrl.helper');
const { sendMail } = require('../utils/mail');
const { generateLeadEmail } = require('../utils/leadEmail');

const LEAD_RECIPIENTS =
  process.env.EMAIL_TO || 'sahilsharma126@gmail.com,avinash@shanviatech.com';

// Notify the team of a new career application. Fire-and-forget.
const sendJobApplicationEmail = (application) => {
  // Resolve the CV stored path to a full, clickable download URL.
  const withUrl = addBaseUrlToPublicPaths(application);
  const subject = `New Job Application - ${application.name || ''}`;
  const html = generateLeadEmail({
    heading: 'New Job Application',
    intro: 'A new application has been submitted via the careers page.',
    data: {
      Name: application.name,
      Email: application.email,
      Mobile: application.mobile,
      Gender: application.gender,
      Location: application.location,
      'Job ID': application.job_id ? String(application.job_id) : '',
      Message: application.message,
      CV: withUrl?.cv || application.cv,
    },
  });
  sendMail(LEAD_RECIPIENTS, subject, html).catch((err) =>
    logger.error(`Failed to send job application email: ${err.message || err}`)
  );
};

const shouldUpload = (value) => Boolean(value && typeof value === 'object' && value.file);

const buildJobApplicationPayload = async (data) => {
  const payload = { ...data };

  if (shouldUpload(payload.cv)) {
    const uploadedCv = await uploadOriginalFile(payload.cv, 'job-application/cv');
    if (!uploadedCv) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload cv');
    }
    payload.cv = uploadedCv;
  }

  return normalizeMetaInformation(payload, 'job-application');
};

const createJobApplication = async (data) => {
  const payload = await buildJobApplicationPayload(data);
  const created = await JobApplicationModel.create(payload);
  sendJobApplicationEmail(created);
  return created;
};

const updateJobApplication = async (jobApplicationId, data) => {
  const payload = await buildJobApplicationPayload(data);
  const updatedJobApplication = await JobApplicationModel.findByIdAndUpdate(jobApplicationId, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedJobApplication) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job application not found');
  }

  return updatedJobApplication;
};

const getJobApplicationDetails = async (filter = {}) => {
  const jobApplication = await JobApplicationModel.findOne(filter);
  if (!jobApplication) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job application details not found');
  }
  return addBaseUrlToPublicPaths(jobApplication);
};

const getJobApplicationList = async (filter = {}, options = {}) => {
  const page = Math.max(parseInt(options.page, 10) || 1, 1);
  const limit = Math.max(parseInt(options.limit, 10) || 10, 1);
  const sort = options.sort || '-createdAt';
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    JobApplicationModel.find(filter).sort(sort).skip(skip).limit(limit),
    JobApplicationModel.countDocuments(filter),
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

const deleteJobApplication = async (jobApplicationId) => {
  const deletedJobApplication = await JobApplicationModel.findByIdAndDelete(jobApplicationId);
  if (!deletedJobApplication) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job application not found');
  }

  return deletedJobApplication;
};

module.exports = {
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
  getJobApplicationDetails,
  getJobApplicationList,
};
