const Joi = require('joi');

const fileInput = Joi.object().keys({
  file: Joi.string().required(),
  filename: Joi.string(),
});

const metaInformationSchema = Joi.object().keys({
  meta_title: Joi.string(),
  meta_description: Joi.string(),
  meta_keywords: Joi.array().items(Joi.string()),
  slug: Joi.string(),
  og_title: Joi.string(),
  og_description: Joi.string(),
  og_image: Joi.alternatives().try(Joi.string(), fileInput),
});

module.exports = {
  metaInformationSchema,
};
