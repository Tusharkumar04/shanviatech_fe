const Joi = require('joi');
const { objectId } = require('./custom.validation');

const formField = Joi.object().keys({
  label: Joi.string().required(),
  is_required: Joi.boolean(),
});

const createSurveyQuery = {
  body: Joi.object().keys({
    name: Joi.string().allow('', null),
    parent_category_id: Joi.string().custom(objectId).allow('', null),
    question: Joi.string().allow('', null),
    sequence: Joi.number().required(),
    sub_sequence: Joi.number(),
    form: Joi.array().items(formField),
  }),
};

const updateSurveyQuery = {
  params: Joi.object().keys({
    surveyQueryId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().allow('', null),
    parent_category_id: Joi.string().custom(objectId).allow('', null),
    question: Joi.string().allow('', null),
    sequence: Joi.number().required(),
    sub_sequence: Joi.number(),
    form: Joi.array().items(formField),
  }),
};

const deleteSurveyQuery = {
  params: Joi.object().keys({
    surveyQueryId: Joi.string().custom(objectId).required(),
  }),
};

const getSurveyQueryDetails = {
  params: Joi.object().keys({
    surveyQueryId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    _id: Joi.string().custom(objectId),
  }),
};

const getSurveyQueryList = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
    sort: Joi.string(),
    name: Joi.string(),
  }),
};

module.exports = {
  createSurveyQuery,
  updateSurveyQuery,
  deleteSurveyQuery,
  getSurveyQueryDetails,
  getSurveyQueryList,
};
