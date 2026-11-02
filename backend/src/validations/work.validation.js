const Joi = require('joi');
const { metaInformationSchema } = require('./metaInformation.validation');

const createFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string().required() });
const updateFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string() });
const createOrUpdateFileInput = Joi.alternatives().try(createFileInput, updateFileInput);

const createOrUpdateWork = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    points: Joi.array().items(Joi.string()),
    image: createOrUpdateFileInput.required(),
    button_title: Joi.string(),
    link: Joi.string(),
    our_process: Joi.object().keys({
      title: Joi.string().required(),
      description: Joi.string().required(),
      icon: createOrUpdateFileInput.required(),
      order: Joi.number(),
    }),
    our_methodology: Joi.object().keys({
      title: Joi.string().required(),
      description: Joi.string().required(),
      order: Joi.number(),
    }),
    metaInformation: metaInformationSchema,
  }).min(1),
};

const getWorkDetails = {
  query: Joi.object().keys({}),
};

module.exports = {
  createOrUpdateWork,
  getWorkDetails,
};
