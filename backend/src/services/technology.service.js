const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const TechnologyModel = require('../models/technology.model');
const { uploadOriginalFile } = require('../middlewares/localFileUpload.middleware');
const { normalizeMetaInformation } = require('./helpers/metaInformation.helper');
const { addBaseUrlToPublicPaths } = require('./helpers/fileUrl.helper');

const shouldUpload = (value) => Boolean(value && typeof value === 'object' && value.file);

const buildTechnologyPayload = async (data) => {
  const payload = { ...data };

  if (shouldUpload(payload.image)) {
    const uploadedImage = await uploadOriginalFile(payload.image, 'technology');
    if (!uploadedImage) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload technology image');
    }
    payload.image = uploadedImage;
  }

  return normalizeMetaInformation(payload, 'technology');
};

const createTechnology = async (data) => {
  const payload = await buildTechnologyPayload(data);
  return TechnologyModel.create(payload);
};

const updateTechnology = async (technologyId, data) => {
  const payload = await buildTechnologyPayload(data);
  const updatedTechnology = await TechnologyModel.findByIdAndUpdate(technologyId, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedTechnology) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Technology not found');
  }

  return updatedTechnology;
};

const getTechnologyDetails = async (filter = {}) => {
  const technology = await TechnologyModel.findOne(filter);
  if (!technology) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Technology details not found');
  }
  return addBaseUrlToPublicPaths(technology);
};

const getTechnologyList = async (filter = {}, options = {}) => {
  const page = Math.max(parseInt(options.page, 10) || 1, 1);
  const limit = Math.max(parseInt(options.limit, 10) || 10, 1);
  const sort = options.sort || 'order createdAt';
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    TechnologyModel.find(filter).sort(sort).skip(skip).limit(limit),
    TechnologyModel.countDocuments(filter),
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

const deleteTechnology = async (technologyId) => {
  const deletedTechnology = await TechnologyModel.findByIdAndDelete(technologyId);
  if (!deletedTechnology) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Technology not found');
  }

  return deletedTechnology;
};

module.exports = {
  createTechnology,
  updateTechnology,
  deleteTechnology,
  getTechnologyDetails,
  getTechnologyList,
};
