const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const ApproachModel = require('../models/approach.model');
const { uploadOriginalFile } = require('../middlewares/localFileUpload.middleware');
const { normalizeMetaInformation } = require('./helpers/metaInformation.helper');
const { addBaseUrlToPublicPaths } = require('./helpers/fileUrl.helper');

const shouldUpload = (value) => Boolean(value && typeof value === 'object' && value.file);

const buildApproachPayload = async (data) => {
  const payload = { ...data };

  if (Array.isArray(payload.images)) {
    payload.images = await Promise.all(
      payload.images.map(async (image) => {
        if (!shouldUpload(image)) {
          return image;
        }
        const uploadedImage = await uploadOriginalFile(image, 'approach');
        if (!uploadedImage) {
          throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload approach image');
        }
        return uploadedImage;
      })
    );
  }

  if (payload.technical_craft && typeof payload.technical_craft === 'object') {
    const technicalCraft = { ...payload.technical_craft };
    if (Array.isArray(technicalCraft.highlights)) {
      technicalCraft.highlights = await Promise.all(
        technicalCraft.highlights.map(async (highlight) => {
          const item = { ...highlight };
          if (shouldUpload(item.logo)) {
            const uploadedLogo = await uploadOriginalFile(item.logo, 'approach');
            if (!uploadedLogo) {
              throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload technical craft logo');
            }
            item.logo = uploadedLogo;
          }
          return item;
        })
      );
    }
    payload.technical_craft = technicalCraft;
  }

  if (payload.why_choose_us && typeof payload.why_choose_us === 'object') {
    const technicalCraft = { ...payload.why_choose_us };
    if (Array.isArray(technicalCraft.highlights)) {
      technicalCraft.highlights = await Promise.all(
        technicalCraft.highlights.map(async (highlight) => {
          const item = { ...highlight };
          if (shouldUpload(item.logo)) {
            const uploadedLogo = await uploadOriginalFile(item.logo, 'approach');
            if (!uploadedLogo) {
              throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload technical craft logo');
            }
            item.logo = uploadedLogo;
          }
          return item;
        })
      );
    }
    payload.why_choose_us = technicalCraft;
  }
  if (payload.hiring_impressive && typeof payload.hiring_impressive === 'object') {
    const hiringImpressive = { ...payload.hiring_impressive };
    if (shouldUpload(hiringImpressive.image)) {
      const uploadedImage = await uploadOriginalFile(hiringImpressive.image, 'approach');
      if (!uploadedImage) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload hiring impressive image');
      }
      hiringImpressive.image = uploadedImage;
    }
    payload.hiring_impressive = hiringImpressive;
  }

  return normalizeMetaInformation(payload, 'approach');
};

const createOrUpdateApproach = async (data) => {
  const payload = await buildApproachPayload(data);
  const existingApproach = await ApproachModel.findOne();
  if (!existingApproach) {
    return ApproachModel.create(payload);
  }

  return ApproachModel.findByIdAndUpdate(existingApproach._id, payload, {
    new: true,
    runValidators: true,
  });
};

const getApproachDetails = async () => {
  const approach = await ApproachModel.findOne();
  if (!approach) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Approach details not found');
  }
  return addBaseUrlToPublicPaths(approach);
};

module.exports = {
  createOrUpdateApproach,
  getApproachDetails,
};
