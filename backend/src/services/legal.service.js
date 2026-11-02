const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const LegalModel = require('../models/legal.model');
const { normalizeMetaInformation } = require('./helpers/metaInformation.helper');
const { addBaseUrlToPublicPaths } = require('./helpers/fileUrl.helper');

const createLegal = async (data) => {
  const payload = await normalizeMetaInformation(data, 'legal');
  return LegalModel.create(payload);
};

const updateLegal = async (legalId, data) => {
  const payload = await normalizeMetaInformation(data, 'legal');
  const updatedLegal = await LegalModel.findByIdAndUpdate(legalId, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedLegal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Legal content not found');
  }

  return updatedLegal;
};

const getLegalDetails = async (filter = {}) => {
  const legal = await LegalModel.findOne(filter);
  if (!legal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Legal content details not found');
  }
  return addBaseUrlToPublicPaths(legal);
};

const getLegalList = async (filter = {}, options = {}) => {
  const page = Math.max(parseInt(options.page, 10) || 1, 1);
  const limit = Math.max(parseInt(options.limit, 10) || 10, 1);
  const sort = options.sort || '-createdAt';
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    LegalModel.find(filter).sort(sort).skip(skip).limit(limit),
    LegalModel.countDocuments(filter),
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

const deleteLegal = async (legalId) => {
  const deletedLegal = await LegalModel.findByIdAndDelete(legalId);
  if (!deletedLegal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Legal content not found');
  }

  return deletedLegal;
};

module.exports = {
  createLegal,
  updateLegal,
  deleteLegal,
  getLegalDetails,
  getLegalList,
};
