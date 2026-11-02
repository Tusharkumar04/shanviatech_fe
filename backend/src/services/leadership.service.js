const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const LeadershipModel = require('../models/leadership.model');
const { uploadOriginalFile } = require('../middlewares/localFileUpload.middleware');
const { normalizeMetaInformation } = require('./helpers/metaInformation.helper');
const { addBaseUrlToPublicPaths } = require('./helpers/fileUrl.helper');

const shouldUpload = (value) => Boolean(value && typeof value === 'object' && value.file);

const buildLeadershipPayload = async (data) => {
  const payload = { ...data };

  if (Array.isArray(payload.members)) {
    payload.members = await Promise.all(
      payload.members.map(async (member) => {
        const item = { ...member };
        if (shouldUpload(item.image)) {
          const uploadedImage = await uploadOriginalFile(item.image, 'leaders');
          if (!uploadedImage) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload leadership member image');
          }
          item.image = uploadedImage;
        }
        return item;
      })
    );
  }

  return normalizeMetaInformation(payload, 'leadership');
};

const createLeadership = async (data) => {
  const payload = await buildLeadershipPayload(data);
  return LeadershipModel.create(payload);
};

const updateLeadership = async (leadershipId, data) => {
  const payload = await buildLeadershipPayload(data);
  const updatedLeadership = await LeadershipModel.findByIdAndUpdate(leadershipId, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedLeadership) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Leadership not found');
  }

  return updatedLeadership;
};

const deleteLeadership = async (leadershipId) => {
  const deletedLeadership = await LeadershipModel.findByIdAndDelete(leadershipId);
  if (!deletedLeadership) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Leadership not found');
  }

  return deletedLeadership;
};

const getLeadershipDetails = async (filter = {}) => {
  const leadership = await LeadershipModel.findOne(filter);
  if (!leadership) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Leadership details not found');
  }
  return addBaseUrlToPublicPaths(leadership);
};

const getLeadershipList = async (filter = {}, options = {}) => {
  const page = Math.max(parseInt(options.page, 10) || 1, 1);
  const limit = Math.max(parseInt(options.limit, 10) || 10, 1);
  const sort = options.sort || 'order createdAt';
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    LeadershipModel.find(filter).sort(sort).skip(skip).limit(limit),
    LeadershipModel.countDocuments(filter),
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

module.exports = {
  createLeadership,
  updateLeadership,
  deleteLeadership,
  getLeadershipDetails,
  getLeadershipList,
};
