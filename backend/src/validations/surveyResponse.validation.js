const Joi = require('joi');
const { objectId } = require('./custom.validation');

const responseItem = Joi.object().keys({
  question: Joi.string().allow('', null),
  answer: Joi.string().allow('', null),
  form: Joi.array().items(
    Joi.object().keys({
      label: Joi.string().allow('', null),
      value: Joi.string().allow('', null),
    })
  ),
});

const createOrUpdate = {
  body: Joi.object().keys({
    uid: Joi.string().required(),
    responses: Joi.array().items(responseItem),
    user_data: Joi.object().unknown(true),
  }),
};

const getResponses = {
  query: Joi.object().keys({
    uid: Joi.string().allow('', null),
  }),
};

const getSurveyResponseList = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
    sort: Joi.string(),
  }),
};

const getSurveyResponseDetails = {
  params: Joi.object().keys({
    surveyResponseId: Joi.string().custom(objectId).required(),
  }),
};

const deleteSurveyResponse = {
  params: Joi.object().keys({
    surveyResponseId: Joi.string().custom(objectId).required(),
  }),
};

const multiDeleteSurveyResponse = {
  body: Joi.object().keys({
    ids: Joi.array().items(Joi.string().custom(objectId)).required(),
  }),
};

module.exports = {
  createOrUpdate,
  getResponses,
  getSurveyResponseList,
  getSurveyResponseDetails,
  deleteSurveyResponse,
  multiDeleteSurveyResponse,
};
