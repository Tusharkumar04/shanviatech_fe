const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { metaInformationSchema } = require('./metaInformation.validation');

const createFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string().required() });
const updateFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string() });

const createTechnology = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
    image: createFileInput.required(),
    button_title: Joi.string(),
    link: Joi.string(),
    order: Joi.number(),
    metaInformation: metaInformationSchema,
  }),
};

const updateTechnology = {
  params: Joi.object().keys({
    technologyId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
    image: updateFileInput.required(),
    button_title: Joi.string(),
    link: Joi.string(),
    order: Joi.number(),
    metaInformation: metaInformationSchema,
  }),
};

const deleteTechnology = {
  params: Joi.object().keys({
    technologyId: Joi.string().custom(objectId).required(),
  }),
};

const getTechnologyDetails = {
  params: Joi.object().keys({
    technologyId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    _id: Joi.string().custom(objectId),
    title: Joi.string(),
    meta_slug: Joi.string(),
  }),
};

const getTechnologyList = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
    sort: Joi.string(),
    title: Joi.string(),
    meta_slug: Joi.string(),
  }),
};

module.exports = {
  createTechnology,
  updateTechnology,
  deleteTechnology,
  getTechnologyDetails,
  getTechnologyList,
};
