const Joi = require('joi');
const { metaInformationSchema } = require('./metaInformation.validation');

const createFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string().required() });
const updateFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string() });
const createOrUpdateFileInput = Joi.alternatives().try(createFileInput, updateFileInput);

const createOrUpdateHome = {
  body: Joi.object().keys({
    banners: Joi.array().items(
      Joi.object().keys({
        title: Joi.string(),
        subtitle: Joi.string(),
        image: createOrUpdateFileInput.required(),
        button_title: Joi.string(),
        link: Joi.string(),
        order: Joi.number(),
      })
    ),
    about: Joi.object().keys({
      title: Joi.string().required(),
      description: Joi.string().required(),
      highlights: Joi.array().items(
        Joi.object().keys({
          title: Joi.string().required(),
          description: Joi.string().required(),
          image: createOrUpdateFileInput.required(),
          button_title: Joi.string(),
          link: Joi.string(),
          order: Joi.number(),
        })
      ),
    }),
    our_approach: Joi.object().keys({
      title: Joi.string().required(),
      subtitle: Joi.string(),
      description: Joi.string().required(),
      image: createOrUpdateFileInput.required(),
      button_title: Joi.string(),
      link: Joi.string(),
    }),
    we_do: Joi.object().keys({
      title: Joi.string().required(),
      subtitle: Joi.string(),
      description: Joi.string().required(),
      image: createOrUpdateFileInput.required(),
      button_title: Joi.string(),
      link: Joi.string(),
    }),
    why_choose: Joi.object().keys({
      title: Joi.string().required(),
      subtitle: Joi.string(),
      description: Joi.string().required(),
      image: createOrUpdateFileInput.required(),
      button_title: Joi.string(),
      link: Joi.string(),
    }),
    metaInformation: metaInformationSchema,
  }).min(1),
};

const getHomeDetails = {
  query: Joi.object().keys({}),
};

module.exports = {
  createOrUpdateHome,
  getHomeDetails,
};
