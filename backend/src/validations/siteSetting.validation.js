const Joi = require('joi');
const { metaInformationSchema } = require('./metaInformation.validation');

const createFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string().required() });
const updateFileInput = Joi.object().keys({ file: Joi.string().required(), filename: Joi.string() });
const createOrUpdateFileInput = Joi.alternatives().try(createFileInput, updateFileInput);

const createOrUpdateSetting = {
  body: Joi.object().keys({
    logo: createOrUpdateFileInput,
    email: Joi.string().email(),
    mobile: Joi.string().pattern(/^[0-9]{10}$/),
    social_links: Joi.object().keys({
      facebook: Joi.string(),
      instagram: Joi.string(),
      twitter: Joi.string(),
      linkedin: Joi.string(),
      youtube: Joi.string(),
    }),
    cin_no: Joi.string(),
    addresses: Joi.array().items(
      Joi.object().keys({
        is_primary: Joi.boolean(),
        email: Joi.string().email(),
        locality: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        country: Joi.string(),
        pin_code: Joi.number(),
        latitude: Joi.number(),
        longitude: Joi.number(),
        image: createOrUpdateFileInput.required(),
      })
    ),
    certificates: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        issue_date: Joi.date(),
        image: createOrUpdateFileInput.required(),
        pdf: createOrUpdateFileInput,
        description: Joi.string(),
        order: Joi.number(),
      })
    ),
    metaInformation: metaInformationSchema,
  }).min(1),
};

const getSiteSettingDetails = {
  query: Joi.object().keys({}),
};

module.exports = {
  createOrUpdateSetting,
  getSiteSettingDetails,
};
