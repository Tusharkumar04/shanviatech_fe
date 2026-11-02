const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { metaInformationSchema } = require('./metaInformation.validation');

const createFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string() });
const updateFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string() });
const createOrUpdateFileInput = Joi.alternatives().try(createFileInput, updateFileInput, Joi.string());

const leadershipBody = {
  title: Joi.string(),
  subtitle: Joi.string(),
  members: Joi.array().items(
    Joi.object().keys({
      name: Joi.string().required(),
      image: createOrUpdateFileInput,
      designation: Joi.string().required(),
      qualification: Joi.string().required(),
      order: Joi.number(),
    })
  ),
  order: Joi.number(),
  metaInformation: metaInformationSchema,
};

const createLeadership = {
  body: Joi.object().keys({
    ...leadershipBody,
    title: leadershipBody.title.required(),
    subtitle: leadershipBody.subtitle.required(),
  }),
};

const updateLeadership = {
  params: Joi.object().keys({
    leadershipId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    ...leadershipBody,
    title: leadershipBody.title.required(),
    subtitle: leadershipBody.subtitle.required(),
  }),
};

const deleteLeadership = {
  params: Joi.object().keys({
    leadershipId: Joi.string().custom(objectId).required(),
  }),
};

const getLeadershipDetails = {
  params: Joi.object().keys({
    leadershipId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    _id: Joi.string().custom(objectId),
    title: Joi.string(),
    meta_slug: Joi.string(),
  }),
};

const getLeadershipList = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
    sort: Joi.string(),
    title: Joi.string(),
    meta_slug: Joi.string(),
  }),
};

module.exports = {
  createLeadership,
  updateLeadership,
  deleteLeadership,
  getLeadershipDetails,
  getLeadershipList,
};
