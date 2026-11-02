const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { metaInformationSchema } = require('./metaInformation.validation');

const createFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string().required() });
const updateFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string() });

const createJob = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    experience: Joi.string().required(),
    salary: Joi.string(),
    location: Joi.string(),
    employment_type: Joi.string().valid('full_time', 'contractual', 'part_time', 'remote'),
    priority: Joi.string().valid('urgent', '15_days_notice_period', '30_days_notice_period', '2_months_notice_period'),
    image: createFileInput,
    skills: Joi.array().items(Joi.string()),
    soft_skills: Joi.array().items(Joi.string()),
    responsibilities: Joi.array().items(Joi.string()),
    requirements: Joi.array().items(Joi.string()),
    we_offer: Joi.array().items(Joi.string()),
    order: Joi.number(),
    metaInformation: metaInformationSchema,
  }),
};

const updateJob = {
  params: Joi.object().keys({
    jobId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    experience: Joi.string().required(),
    location: Joi.string(),
    salary: Joi.string(),
    employment_type: Joi.string().valid('full_time', 'contractual', 'part_time', 'remote'),
    priority: Joi.string().valid('urgent', '15_days_notice_period', '30_days_notice_period', '2_months_notice_period'),
    image: updateFileInput,
    skills: Joi.array().items(Joi.string()),
    soft_skills: Joi.array().items(Joi.string()),
    responsibilities: Joi.array().items(Joi.string()),
    requirements: Joi.array().items(Joi.string()),
    we_offer: Joi.array().items(Joi.string()),
    order: Joi.number(),
    metaInformation: metaInformationSchema,
  }),
};

const deleteJob = {
  params: Joi.object().keys({
    jobId: Joi.string().custom(objectId).required(),
  }),
};

const getJobDetails = {
  params: Joi.object().keys({
    jobId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    _id: Joi.string().custom(objectId),
    slug: Joi.string(),
    meta_slug: Joi.string(),
  }),
};

const getJobList = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
    sort: Joi.string(),
    slug: Joi.string(),
    employment_type: Joi.string().valid('full_time', 'contractual', 'part_time', 'remote'),
    priority: Joi.string().valid('urgent', '15_days_notice_period', '30_days_notice_period', '2_months_notice_period'),
    meta_slug: Joi.string(),
  }),
};

module.exports = {
  createJob,
  updateJob,
  deleteJob,
  getJobDetails,
  getJobList,
};
