const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const SurveyQueryModel = require('../models/surveyQuery.model');

const createSurveyQuery = async (data) => {
  const payload = { ...data };
  if (!payload.parent_category_id) {
    payload.parent_category_id = null;
  }
  return SurveyQueryModel.create(payload);
};

const updateSurveyQuery = async (surveyQueryId, data) => {
  const payload = { ...data };
  if (!payload.parent_category_id) {
    payload.parent_category_id = null;
  }

  const updated = await SurveyQueryModel.findByIdAndUpdate(surveyQueryId, payload, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Survey query not found');
  }

  return updated;
};

const getSurveyQueryDetails = async (filter = {}) => {
  // No populate — the edit form needs the raw parent_category_id value.
  const surveyQuery = await SurveyQueryModel.findOne(filter);
  if (!surveyQuery) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Survey query not found');
  }
  return surveyQuery;
};

const getSurveyQueryList = async (filter = {}, options = {}) => {
  const page = Math.max(parseInt(options.page, 10) || 1, 1);
  const limit = Math.max(parseInt(options.limit, 10) || 10, 1);
  const sort = options.sort || 'sequence sub_sequence';
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    SurveyQueryModel.find(filter).populate('parent_category_id', 'name').sort(sort).skip(skip).limit(limit),
    SurveyQueryModel.countDocuments(filter),
  ]);

  return {
    items,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Flat list of all parent candidates for the admin dropdown.
const getParents = async () => {
  return SurveyQueryModel.find({}).sort('sequence sub_sequence');
};

// Flat list consumed by the public popup (buildCategoryTree happens client-side).
const getPublicList = async () => {
  return SurveyQueryModel.find({}).sort('sequence sub_sequence');
};

const deleteSurveyQuery = async (surveyQueryId) => {
  const deleted = await SurveyQueryModel.findByIdAndDelete(surveyQueryId);
  if (!deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Survey query not found');
  }
  return deleted;
};

module.exports = {
  createSurveyQuery,
  updateSurveyQuery,
  getSurveyQueryDetails,
  getSurveyQueryList,
  getParents,
  getPublicList,
  deleteSurveyQuery,
};
