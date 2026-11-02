const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { metaInformationSchema } = require('./metaInformation.validation');

const imageItem = Joi.alternatives().try(
  Joi.string(),
  Joi.object().keys({
    file: Joi.string().required(),
    filename: Joi.string(),
  }),
);

const createProduct = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    subtitle: Joi.string(),
    description: Joi.string().required(),
    key_features: Joi.array().items(Joi.string()),
    images: Joi.array().items(imageItem),
    order: Joi.number(),
    metaInformation: metaInformationSchema,
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    title: Joi.string().required(),
    subtitle: Joi.string(),
    description: Joi.string().required(),
    key_features: Joi.array().items(Joi.string()),
    images: Joi.array().items(imageItem),
    order: Joi.number(),
    metaInformation: metaInformationSchema,
  }),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
  }),
};

const getProductDetails = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    _id: Joi.string().custom(objectId),
  }),
};

const getProductList = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
    sort: Joi.string(),
    search: Joi.string(),
  }),
};

const createOrUpdateProduct = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    subtitle: Joi.string(),
    description: Joi.string().required(),
    key_features: Joi.array().items(Joi.string()),
    images: Joi.array().items(imageItem),
    order: Joi.number(),
    metaInformation: metaInformationSchema,
  }),
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  getProductList,
  createOrUpdateProduct,
};