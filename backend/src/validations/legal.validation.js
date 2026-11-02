const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { metaInformationSchema } = require('./metaInformation.validation');

const legalBody = {
  type: Joi.string().valid('privacy-policy', 'terms-and-conditions', 'cookie-policy', 'refund-policy', 'shipping-policy'),
  title: Joi.string(),
  version: Joi.string(),
  effectiveDate: Joi.date(),
  content: Joi.string(),
  sections: Joi.array().items(
    Joi.object().keys({
      heading: Joi.string(),
      content: Joi.string(),
      order: Joi.number(),
    })
  ),
  publishedAt: Joi.date(),
  metaInformation: metaInformationSchema,
};

const createLegal = {
  body: Joi.object().keys({
    ...legalBody,
    type: legalBody.type.required(),
    title: legalBody.title.required(),
    content: legalBody.content.required(),
  }),
};

const updateLegal = {
  params: Joi.object().keys({
    legalId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    ...legalBody,
    type: legalBody.type.required(),
    title: legalBody.title.required(),
    content: legalBody.content.required(),
  }),
};

const deleteLegal = {
  params: Joi.object().keys({
    legalId: Joi.string().custom(objectId).required(),
  }),
};

const getLegalDetails = {
  params: Joi.object().keys({
    type: Joi.string().valid('privacy-policy', 'terms-and-conditions', 'cookie-policy', 'refund-policy', 'shipping-policy'),
  }),
  query: Joi.object().keys({
    _id: Joi.string().custom(objectId),
    type: Joi.string().valid('privacy-policy', 'terms-and-conditions'),
    meta_slug: Joi.string(),
  }),
};

const getLegalList = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
    sort: Joi.string(),
    type: Joi.string().valid('privacy-policy', 'terms-and-conditions'),
    meta_slug: Joi.string(),
  }),
};

module.exports = {
  createLegal,
  updateLegal,
  deleteLegal,
  getLegalDetails,
  getLegalList,
};
