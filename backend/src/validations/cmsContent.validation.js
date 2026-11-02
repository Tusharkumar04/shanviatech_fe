const Joi = require('joi');
const { metaInformationSchema } = require('./metaInformation.validation');

const createFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string().required() });
const updateFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string() });
const createOrUpdateFileInput = Joi.alternatives().try(createFileInput, updateFileInput);

const createOrUpdateCmsContent = {
  body: Joi.object().keys({
    reach_us: Joi.object().keys({
      title: Joi.string().required(),
      image: createOrUpdateFileInput.required(),
      description: Joi.string().required(),
      button_title: Joi.string(),
      link: Joi.string(),
    }),
    client: Joi.object().keys({
      title: Joi.string().required(),
      image: createOrUpdateFileInput.required(),
      description: Joi.string().required(),
      key_points: Joi.array().items(Joi.string()),
      button_title: Joi.string(),
      link: Joi.string(),
    }),
    metaInformation: metaInformationSchema,
  }).min(1),
};

const getCmsContentDetails = {
  query: Joi.object().keys({}),
};

module.exports = {
  createOrUpdateCmsContent,
  getCmsContentDetails,
};
