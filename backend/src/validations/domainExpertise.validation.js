const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { metaInformationSchema } = require('./metaInformation.validation');

const createFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string().required() });
const updateFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string() });

const createDomainExpertise = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    image: createFileInput.required(),
    description: Joi.string(),
    order: Joi.number(),
    metaInformation: metaInformationSchema,
  }),
};

const updateDomainExpertise = {
  params: Joi.object().keys({
    domainExpertiseId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    title: Joi.string().required(),
    image: updateFileInput.required(),
    description: Joi.string(),
    order: Joi.number(),
    metaInformation: metaInformationSchema,
  }),
};

const deleteDomainExpertise = {
  params: Joi.object().keys({
    domainExpertiseId: Joi.string().custom(objectId).required(),
  }),
};

const getDomainExpertiseDetails = {
  params: Joi.object().keys({
    domainExpertiseId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    _id: Joi.string().custom(objectId),
    title: Joi.string(),
    meta_slug: Joi.string(),
  }),
};

const getDomainExpertiseList = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
    sort: Joi.string(),
    title: Joi.string(),
    meta_slug: Joi.string(),
  }),
};

module.exports = {
  createDomainExpertise,
  updateDomainExpertise,
  deleteDomainExpertise,
  getDomainExpertiseDetails,
  getDomainExpertiseList,
};
