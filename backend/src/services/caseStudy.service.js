const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const CaseStudyModel = require('../models/caseStudy.model');
const { uploadOriginalFile } = require('../middlewares/localFileUpload.middleware');
const { normalizeMetaInformation } = require('./helpers/metaInformation.helper');
const { addBaseUrlToPublicPaths } = require('./helpers/fileUrl.helper');

const shouldUpload = (value) => Boolean(value && typeof value === 'object' && value.file);

const buildCaseStudyPayload = async (data) => {
  const payload = { ...data };

  if (shouldUpload(payload.image)) {
    const uploadedImage = await uploadOriginalFile(payload.image, 'case-study');
    if (!uploadedImage) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload case study image');
    }
    payload.image = uploadedImage;
  }

  return normalizeMetaInformation(payload, 'case-study');
};

const createCaseStudy = async (data) => {
  const payload = await buildCaseStudyPayload(data);
  return CaseStudyModel.create(payload);
};

const updateCaseStudy = async (caseStudyId, data) => {
  const payload = await buildCaseStudyPayload(data);
  const updatedCaseStudy = await CaseStudyModel.findByIdAndUpdate(caseStudyId, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedCaseStudy) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Case study not found');
  }

  return updatedCaseStudy;
};

const getCaseStudyDetails = async (filter = {}) => {
  const caseStudy = await CaseStudyModel.findOne(filter);
  if (!caseStudy) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Case study details not found');
  }
  return addBaseUrlToPublicPaths(caseStudy);
};

const getCaseStudyList = async (filter = {}, options = {}) => {
  const page = Math.max(parseInt(options.page, 10) || 1, 1);
  const limit = Math.max(parseInt(options.limit, 10) || 10, 1);
  const sort = options.sort || 'order createdAt';
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    CaseStudyModel.find(filter).sort(sort).skip(skip).limit(limit),
    CaseStudyModel.countDocuments(filter),
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

const deleteCaseStudy = async (caseStudyId) => {
  const deletedCaseStudy = await CaseStudyModel.findByIdAndDelete(caseStudyId);
  if (!deletedCaseStudy) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Case study not found');
  }

  return deletedCaseStudy;
};

module.exports = {
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
  getCaseStudyDetails,
  getCaseStudyList,
};
