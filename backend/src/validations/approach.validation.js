const Joi = require('joi');
const { metaInformationSchema } = require('./metaInformation.validation');

const createFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string().required() });
const updateFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string() });
const createOrUpdateFileInput = Joi.alternatives().try(createFileInput, updateFileInput);

const createOrUpdateApproach = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    subtitle: Joi.string().required(),
    images: Joi.array().items(createOrUpdateFileInput),
    description: Joi.string(),
    our_approach: Joi.string(),
    our_mission: Joi.string(),
    why_choose_us: Joi.object().keys({
      title: Joi.string().required(),
      description: Joi.string().required(),
      highlights: Joi.array().items(
        Joi.object().keys({
          title: Joi.string().required(),
          description: Joi.string().required(),
          logo: createOrUpdateFileInput.required(),
        })
      ),
    }),
    technical_craft: Joi.object().keys({
      title: Joi.string().required(),
      description: Joi.string().required(),
      highlights: Joi.array().items(
        Joi.object().keys({
          title: Joi.string().required(),
          logo: createOrUpdateFileInput.required(),
        })
      ),
    }),
    hiring_impressive: Joi.object().keys({
      title: Joi.string().required(),
      subtitle: Joi.string().required(),
      image: createOrUpdateFileInput.required(),
      button_title: Joi.string(),
      link: Joi.string(),
    }),
    metaInformation: metaInformationSchema,
  }).min(1),
}

const getApproachDetails = {
  query: Joi.object().keys({}),
};

module.exports = {
  createOrUpdateApproach,
  getApproachDetails,
};
