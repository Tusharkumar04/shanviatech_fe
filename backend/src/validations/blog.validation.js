const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { metaInformationSchema } = require('./metaInformation.validation');

const createFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string().required() });
const updateFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string() });

const createBlog = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    short_description: Joi.string().required(),
    description: Joi.string().required(),
    image: createFileInput,
    // author: Joi.string().custom(objectId).required(),
    order: Joi.number().integer(),
    metaInformation: metaInformationSchema,
  }),
};

const updateBlog = {
  params: Joi.object().keys({
    blogId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    title: Joi.string().required(),
    short_description: Joi.string().required(),
    subtitle: Joi.string(),
    slug: Joi.string(),
    description: Joi.string().required(),
    image: updateFileInput,
    // author: Joi.string().custom(objectId).required(),
    order: Joi.number().integer(),
    metaInformation: metaInformationSchema,
  }),
};

const deleteBlog = {
  params: Joi.object().keys({
    blogId: Joi.string().custom(objectId).required(),
  }),
};

const getBlogDetails = {
  params: Joi.object().keys({
    slug: Joi.string(),
  }),
  query: Joi.object().keys({
    _id: Joi.string().custom(objectId),
    slug: Joi.string(),
    meta_slug: Joi.string(),
  }),
};

const getBlogList = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
    sort: Joi.string(),
    author: Joi.string().custom(objectId),
    slug: Joi.string(),
    meta_slug: Joi.string(),
  }),
};

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogDetails,
  getBlogList,
};
