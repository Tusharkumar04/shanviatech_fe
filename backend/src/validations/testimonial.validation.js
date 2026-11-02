const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { metaInformationSchema } = require('./metaInformation.validation');

const createFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string() });
const updateFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string() });

const createTestimonial = {
  body: Joi.object().keys({
    author_name: Joi.string().required(),
    author_image: createFileInput,
    author_location: Joi.string(),
    description: Joi.string().required(),
    order: Joi.number(),
    metaInformation: metaInformationSchema,
  }),
};

const updateTestimonial = {
  params: Joi.object().keys({
    testimonialId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    author_name: Joi.string().required(),
    author_image: updateFileInput,
    author_location: Joi.string(),
    description: Joi.string().required(),
    order: Joi.number(),
    metaInformation: metaInformationSchema,
  }),
};

const deleteTestimonial = {
  params: Joi.object().keys({
    testimonialId: Joi.string().custom(objectId).required(),
  }),
};

const getTestimonialDetails = {
  params: Joi.object().keys({
    testimonialId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    _id: Joi.string().custom(objectId),
    author_name: Joi.string(),
    meta_slug: Joi.string(),
  }),
};

const getTestimonialList = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
    sort: Joi.string(),
    author_name: Joi.string(),
    meta_slug: Joi.string(),
  }),
};

module.exports = {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTestimonialDetails,
  getTestimonialList,
};
