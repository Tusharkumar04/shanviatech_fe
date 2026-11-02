const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const ReachModel = require('../models/reach.model');
const { normalizeMetaInformation } = require('./helpers/metaInformation.helper');
const { addBaseUrlToPublicPaths } = require('./helpers/fileUrl.helper');
const { sendMail } = require('../utils/mail');
const { generateLeadEmail } = require('../utils/leadEmail');

const LEAD_RECIPIENTS =
  process.env.EMAIL_TO || 'sahilsharma126@gmail.com,avinash@shanviatech.com';

// Notify the team of a new Reach Us / Contact enquiry. Fire-and-forget.
const sendReachEmail = (reach) => {
  const subject = `New Contact Enquiry - ${reach.name || ''}`;
  const html = generateLeadEmail({
    heading: 'New Contact Enquiry (Reach Us)',
    intro: 'A new enquiry has been submitted via the Reach Us / Contact form.',
    data: {
      Name: reach.name,
      Email: reach.email,
      Mobile: reach.mobile,
      Subject: reach.subject,
      Message: reach.message,
    },
  });
  sendMail(LEAD_RECIPIENTS, subject, html).catch((err) =>
    logger.error(`Failed to send reach enquiry email: ${err.message || err}`)
  );
};

const createReach = async (data) => {
  const payload = await normalizeMetaInformation(data, 'reach');
  const created = await ReachModel.create(payload);
  sendReachEmail(created);
  return created;
};

const updateReach = async (reachId, data) => {
  const payload = await normalizeMetaInformation(data, 'reach');
  const updatedReach = await ReachModel.findByIdAndUpdate(reachId, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedReach) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reach record not found');
  }

  return updatedReach;
};

const getReachDetails = async (filter = {}) => {
  const reach = await ReachModel.findOne(filter);
  if (!reach) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reach details not found');
  }
  return addBaseUrlToPublicPaths(reach);
};

const getReachList = async (filter = {}, options = {}) => {
  const page = Math.max(parseInt(options.page, 10) || 1, 1);
  const limit = Math.max(parseInt(options.limit, 10) || 10, 1);
  const sort = options.sort || '-createdAt';
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    ReachModel.find(filter).sort(sort).skip(skip).limit(limit),
    ReachModel.countDocuments(filter),
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

const deleteReach = async (reachId) => {
  const deletedReach = await ReachModel.findByIdAndDelete(reachId);
  if (!deletedReach) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reach record not found');
  }

  return deletedReach;
};

module.exports = {
  createReach,
  updateReach,
  deleteReach,
  getReachDetails,
  getReachList,
};
