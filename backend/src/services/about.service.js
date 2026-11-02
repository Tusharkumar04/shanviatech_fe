const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const AboutModel = require('../models/about.model');
const { normalizeMetaInformation } = require('./helpers/metaInformation.helper');
const { addBaseUrlToPublicPaths } = require('./helpers/fileUrl.helper');

const createAbout = async (data) => {
  const isExist = await AboutModel.findOne({});
  const payload = await normalizeMetaInformation(data, 'about');
  if (payload?.description) {
    payload.description = payload.description.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  }
  if (payload?.our_journey) {
    payload.our_journey = payload.our_journey.map((journey) => {
      if (journey?.description) {
        journey.description = journey.description.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      }
      return journey;
    });
  }

  if (isExist) {
    return AboutModel.findByIdAndUpdate(isExist._id, payload, {
      new: true,
      runValidators: true,
    });
  } else {
    return AboutModel.create(payload);
  }
};

const getAboutDetails = async () => {
  const about = await AboutModel.findOne();
  if (!about) {
    throw new ApiError(httpStatus.NOT_FOUND, 'About details not found');
  }
  return addBaseUrlToPublicPaths(about);
};

module.exports = {
  createAbout,
  getAboutDetails,
};
