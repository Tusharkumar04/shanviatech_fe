const Joi = require('joi');
const { objectId, pdfFile } = require('./custom.validation');
const { metaInformationSchema } = require('./metaInformation.validation');

const createFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string().required() }).custom(pdfFile);
const updateFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string() }).custom(pdfFile);

const createJobApplication = {
  body: Joi.object().keys({
    job_id: Joi.string().custom(objectId).required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().required(),
    message: Joi.string().optional(),
    gender: Joi.string().valid('male', 'female'),
    cv: createFileInput.required(),
    location: Joi.string(),
    status: Joi.string().valid('pending', 'reviewed', 'rejected', 'accepted'),
    metaInformation: metaInformationSchema,
  }),
};

const updateJobApplication = {
  params: Joi.object().keys({
    jobApplicationId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    job_id: Joi.string().custom(objectId).required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().required(),
    gender: Joi.string().valid('male', 'female'),
    cv: updateFileInput.required(),
    location: Joi.string(),
    status: Joi.string().valid('pending', 'reviewed', 'rejected', 'accepted'),
    metaInformation: metaInformationSchema,
  }),
};

const deleteJobApplication = {
  params: Joi.object().keys({
    jobApplicationId: Joi.string().custom(objectId).required(),
  }),
};

const getJobApplicationDetails = {
  params: Joi.object().keys({
    jobApplicationId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    _id: Joi.string().custom(objectId),
    job_id: Joi.string().custom(objectId),
    email: Joi.string().email(),
    meta_slug: Joi.string(),
  }),
};

const getJobApplicationList = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
    sort: Joi.string(),
    job_id: Joi.string().custom(objectId),
    status: Joi.string().valid('pending', 'reviewed', 'rejected', 'accepted'),
    meta_slug: Joi.string(),
  }),
};

module.exports = {
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
  getJobApplicationDetails,
  getJobApplicationList,
};
