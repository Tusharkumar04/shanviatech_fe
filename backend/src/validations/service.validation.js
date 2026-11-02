const Joi = require('joi');
const { metaInformationSchema } = require('./metaInformation.validation');

const createFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string().required() });
const updateFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string() });
const createOrUpdateFileInput = Joi.alternatives().try(createFileInput, updateFileInput);

const createOrUpdateService = {
  body: Joi.object().keys({
    services: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        title: Joi.string().required(),
        subtitle: Joi.string(),
        image: createOrUpdateFileInput.required(),
        order: Joi.number(),
        show_in_page: Joi.boolean(),
        metaInformation: metaInformationSchema,
        highlights: Joi.array().items(
          Joi.object().keys({
            title: Joi.string().required(),
            description: Joi.string().required(),
            image: Joi.array().items(createOrUpdateFileInput),
            order: Joi.number(),
          })
        ),
      })
    ),
    digital_experiences: Joi.object().keys({
      title: Joi.string().required(),
      subtitle: Joi.string().required(),
      description: Joi.string().required(),
      button_title: Joi.string(),
      link: Joi.string(),
    }),
    agile_project: Joi.object().keys({
      title: Joi.string().required(),
      subtitle: Joi.string().required(),
      description: Joi.string().required(),
      button_title: Joi.string(),
      link: Joi.string(),
      image: createOrUpdateFileInput,
    }),
    digital_solutions: Joi.array().items(
      Joi.object().keys({
        title: Joi.string().required(),
        subtitle: Joi.string(),
        highlights: Joi.array().items(
          Joi.object().keys({
            title: Joi.string().required(),
            subtitle: Joi.string().required(),
            description: Joi.string().required(),
            description2: Joi.string().required(),
            image: createOrUpdateFileInput.required(),
            button_title: Joi.string(),
            link: Joi.string(),
            order: Joi.number(),
          })
        ),
      })
    ),
    quality_assurance: Joi.object().keys({
      title: Joi.string().required(),
      subtitle: Joi.string().required(),
      description: Joi.string().required(),
      image: createOrUpdateFileInput.required(),
      button_title: Joi.string(),
      link: Joi.string(),
    }),
    metaInformation: metaInformationSchema,
  }).min(1),
};

const getServiceDetails = {
  query: Joi.object().keys({}),
};

module.exports = {
  createOrUpdateService,
  getServiceDetails,
};
