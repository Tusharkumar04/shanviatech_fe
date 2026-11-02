const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const CmsContentModel = require('../models/cmsContent.model');
const { uploadOriginalFile } = require('../middlewares/localFileUpload.middleware');
const { normalizeMetaInformation } = require('./helpers/metaInformation.helper');
const { addBaseUrlToPublicPaths } = require('./helpers/fileUrl.helper');

const shouldUpload = (value) => Boolean(value && typeof value === 'object' && value.file);

const buildCmsContentPayload = async (data) => {
  const payload = { ...data };

  if (payload.reach_us && typeof payload.reach_us === 'object') {
    const reachUs = { ...payload.reach_us };
    if (shouldUpload(reachUs.image)) {
      const uploadedImage = await uploadOriginalFile(reachUs.image, 'cms-content');
      if (!uploadedImage) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload reach us image');
      }
      reachUs.image = uploadedImage;
    }
    payload.reach_us = reachUs;
  }

  if (payload.client && typeof payload.client === 'object') {
    const client = { ...payload.client };
    if (shouldUpload(client.image)) {
      const uploadedImage = await uploadOriginalFile(client.image, 'cms-content');
      if (!uploadedImage) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload client image');
      }
      client.image = uploadedImage;
    }
    payload.client = client;
  }

  return normalizeMetaInformation(payload, 'cms-content');
};

const createOrUpdateCmsContent = async (data) => {
  const payload = await buildCmsContentPayload(data);
  const existingCmsContent = await CmsContentModel.findOne();
  if (!existingCmsContent) {
    return CmsContentModel.create(payload);
  }

  return CmsContentModel.findByIdAndUpdate(existingCmsContent._id, payload, {
    new: true,
    runValidators: true,
  });
};

const getCmsContentDetails = async () => {
  const cmsContent = await CmsContentModel.findOne();
  if (!cmsContent) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cms content details not found');
  }
  return addBaseUrlToPublicPaths(cmsContent);
};

module.exports = {
  createOrUpdateCmsContent,
  getCmsContentDetails,
};
