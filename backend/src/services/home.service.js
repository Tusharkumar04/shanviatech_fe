const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const HomeModel = require('../models/home.model');
const { uploadOriginalFile } = require('../middlewares/localFileUpload.middleware');
const { normalizeMetaInformation } = require('./helpers/metaInformation.helper');
const { addBaseUrlToPublicPaths } = require('./helpers/fileUrl.helper');

const shouldUpload = (value) => Boolean(value && typeof value === 'object' && value.file);

const buildHomePayload = async (data) => {
  const payload = { ...data };

  if (Array.isArray(payload.banners)) {
    payload.banners = await Promise.all(
      payload.banners.map(async (banner) => {
        const item = { ...banner };
        if (shouldUpload(item.image)) {
          const uploadedImage = await uploadOriginalFile(item.image, 'home/banners');
          if (!uploadedImage) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload banner image');
          }
          item.image = uploadedImage;
        }
        return item;
      })
    );
  }

  if (payload.about && typeof payload.about === 'object') {
    const about = { ...payload.about };
    if (Array.isArray(about.highlights)) {
      about.highlights = await Promise.all(
        about.highlights.map(async (highlight) => {
          const item = { ...highlight };
          if (shouldUpload(item.image)) {
            const uploadedImage = await uploadOriginalFile(item.image, 'home/about-highlights');
            if (!uploadedImage) {
              throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload about highlight image');
            }
            item.image = uploadedImage;
          }
          return item;
        })
      );
    }
    payload.about = about;
  }

  if (payload.our_approach && typeof payload.our_approach === 'object') {
    const ourApproach = { ...payload.our_approach };
    if (shouldUpload(ourApproach.image)) {
      const uploadedImage = await uploadOriginalFile(ourApproach.image, 'home/our-approach');
      if (!uploadedImage) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload our approach image');
      }
      ourApproach.image = uploadedImage;
    }
    payload.our_approach = ourApproach;
  }

  if (payload.we_do && typeof payload.we_do === 'object') {
    const weDo = { ...payload.we_do };
    if (shouldUpload(weDo.image)) {
      const uploadedImage = await uploadOriginalFile(weDo.image, 'home/we-do');
      if (!uploadedImage) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload we do image');
      }
      weDo.image = uploadedImage;
    }
    payload.we_do = weDo;
  }

  if (payload.why_choose && typeof payload.why_choose === 'object') {
    const whyChoose = { ...payload.why_choose };
    if (shouldUpload(whyChoose.image)) {
      const uploadedImage = await uploadOriginalFile(whyChoose.image, 'home/why-choose');
      if (!uploadedImage) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload why choose image');
      }
      whyChoose.image = uploadedImage;
    }
    payload.why_choose = whyChoose;
  }

  return normalizeMetaInformation(payload, 'home');
};

const createOrUpdateHome = async (data) => {
  const payload = await buildHomePayload(data);
  const existingHome = await HomeModel.findOne();
  if (!existingHome) {
    return HomeModel.create(payload);
  }

  return HomeModel.findByIdAndUpdate(existingHome._id, payload, {
    new: true,
    runValidators: true,
  });
};

const getHomeDetails = async () => {
  const home = await HomeModel.findOne();
  if (!home) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Home details not found');
  }
  return addBaseUrlToPublicPaths(home);
};

module.exports = {
  createOrUpdateHome,
  getHomeDetails,
};
