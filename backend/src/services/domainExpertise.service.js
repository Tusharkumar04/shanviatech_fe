const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const DomainExpertiseModel = require('../models/domainExpertise.model');
const { uploadOriginalFile } = require('../middlewares/localFileUpload.middleware');
const { normalizeMetaInformation } = require('./helpers/metaInformation.helper');
const { addBaseUrlToPublicPaths } = require('./helpers/fileUrl.helper');

const shouldUpload = (value) => Boolean(value && typeof value === 'object' && value.file);

const buildDomainExpertisePayload = async (data) => {
  const payload = { ...data };

  if (shouldUpload(payload.image)) {
    const uploadedImage = await uploadOriginalFile(payload.image, 'domain-expertise');
    if (!uploadedImage) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload domain expertise image');
    }
    payload.description = payload.description ? payload.description.replace(/&lt;/g, '<').replace(/&gt;/g, '>') : '';
    payload.image = uploadedImage;
  }

  return normalizeMetaInformation(payload, 'domain-expertise');
};

const createDomainExpertise = async (data) => {
  const payload = await buildDomainExpertisePayload(data);
  return DomainExpertiseModel.create(payload);
};

const updateDomainExpertise = async (domainExpertiseId, data) => {
  const payload = await buildDomainExpertisePayload(data);
  const updatedDomainExpertise = await DomainExpertiseModel.findByIdAndUpdate(domainExpertiseId, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedDomainExpertise) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Domain expertise not found');
  }

  return updatedDomainExpertise;
};

const getDomainExpertiseDetails = async (filter = {}) => {
  const domainExpertise = await DomainExpertiseModel.findOne(filter);
  if (!domainExpertise) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Domain expertise details not found');
  }
  return addBaseUrlToPublicPaths(domainExpertise);
};

const getDomainExpertiseList = async (filter = {}, options = {}) => {
  const page = Math.max(parseInt(options.page, 10) || 1, 1);
  const limit = Math.max(parseInt(options.limit, 10) || 10, 1);
  const sort = options.sort || 'order createdAt';
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    DomainExpertiseModel.find(filter).sort(sort).skip(skip).limit(limit),
    DomainExpertiseModel.countDocuments(filter),
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

const deleteDomainExpertise = async (domainExpertiseId) => {
  const deletedDomainExpertise = await DomainExpertiseModel.findByIdAndDelete(domainExpertiseId);
  if (!deletedDomainExpertise) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Domain expertise not found');
  }

  return deletedDomainExpertise;
};

module.exports = {
  createDomainExpertise,
  updateDomainExpertise,
  deleteDomainExpertise,
  getDomainExpertiseDetails,
  getDomainExpertiseList,
};
