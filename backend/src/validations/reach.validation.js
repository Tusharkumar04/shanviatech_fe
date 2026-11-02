const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { metaInformationSchema } = require('./metaInformation.validation');

const createReach = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().required(),
    subject: Joi.string().required(),
    message: Joi.string(),
    status: Joi.string().valid('pending', 'read', 'archived'),
    // Public form supplies the uid used for OTP verification. Optional so the
    // admin panel can still create records directly.
    uid: Joi.string(),
    metaInformation: metaInformationSchema,
  }),
};

const updateReach = {
  params: Joi.object().keys({
    reachId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().required(),
    subject: Joi.string().required(),
    message: Joi.string(),
    status: Joi.string().valid('pending', 'read', 'archived'),
    metaInformation: metaInformationSchema,
  }),
};

const deleteReach = {
  params: Joi.object().keys({
    reachId: Joi.string().custom(objectId).required(),
  }),
};

const getReachDetails = {
  params: Joi.object().keys({
    reachId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    _id: Joi.string().custom(objectId),
    email: Joi.string().email(),
    meta_slug: Joi.string(),
  }),
};

const getReachList = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
    sort: Joi.string(),
    status: Joi.string().valid('pending', 'read', 'archived'),
    email: Joi.string().email(),
    meta_slug: Joi.string(),
  }),
};

module.exports = {
  createReach,
  updateReach,
  deleteReach,
  getReachDetails,
  getReachList,
};
