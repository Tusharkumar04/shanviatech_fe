const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { metaInformationSchema } = require('./metaInformation.validation');

const createFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string().required() });
const updateFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string() });

const createProject = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    subtitle: Joi.string(),
    image: createFileInput.required(),
    description: Joi.string().required(),
    order: Joi.number(),
    metaInformation: metaInformationSchema,
  }),
};

const updateProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    title: Joi.string().required(),
    subtitle: Joi.string(),
    image: updateFileInput.required(),
    description: Joi.string().required(),
    order: Joi.number(),
    metaInformation: metaInformationSchema,
  }),
};

const deleteProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
};

const getProjectDetails = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    _id: Joi.string().custom(objectId),
    title: Joi.string(),
    meta_slug: Joi.string(),
  }),
};

const getProjectList = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
    sort: Joi.string(),
    title: Joi.string(),
    meta_slug: Joi.string(),
  }),
};

module.exports = {
  createProject,
  updateProject,
  deleteProject,
  getProjectDetails,
  getProjectList,
};
