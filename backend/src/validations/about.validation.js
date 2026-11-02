const Joi = require('joi');
const { metaInformationSchema } = require('./metaInformation.validation');

const createAbout = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    subtitle: Joi.string().required(),
    description: Joi.string().required(),
    our_journey: Joi.array().items(
      Joi.object().keys({
        title: Joi.string().required(),
        subtitle: Joi.string().required(),
        year: Joi.number(),
        description: Joi.string(),
        order: Joi.number(),
      })
    ),
    metaInformation: metaInformationSchema,
  }),
};

const getAboutDetails = {
  query: Joi.object().keys({}),
};

module.exports = {
  createAbout,
  getAboutDetails,
};
