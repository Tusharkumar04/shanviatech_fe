const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const SiteSettingModel = require('../models/siteSetting.model');
const { uploadOriginalFile } = require('../middlewares/localFileUpload.middleware');
const { normalizeMetaInformation } = require('./helpers/metaInformation.helper');
const { addBaseUrlToPublicPaths } = require('./helpers/fileUrl.helper');

const shouldUpload = (value) => Boolean(value && typeof value === 'object' && value.file);

const buildSettingPayload = async (data) => {
  const payload = { ...data };

  if (shouldUpload(payload.logo)) {
    const uploadedLogo = await uploadOriginalFile(payload.logo, 'site-setting/logo');
    if (!uploadedLogo) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload logo');
    }
    payload.logo = uploadedLogo;
  }

  if (Array.isArray(payload.certificates)) {
    payload.certificates = await Promise.all(
      payload.certificates.map(async (certificate) => {
        const item = { ...certificate };
        if (shouldUpload(item.image)) {
          const uploadedImage = await uploadOriginalFile(item.image, 'site-setting/certificates');
          if (!uploadedImage) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload certificate image');
          }
          item.image = uploadedImage;
        }

        if (shouldUpload(item.pdf)) {
          const uploadedPdf = await uploadOriginalFile(item.pdf, 'site-setting/certificates-pdf');
          if (!uploadedPdf) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload certificate pdf');
          }
          item.pdf = uploadedPdf;
        }
        return item;
      })
    );
  }
  if (Array.isArray(payload.addresses)) {
    payload.addresses = await Promise.all(
      payload.addresses.map(async (certificate) => {
        const item = { ...certificate };
        if (shouldUpload(item.image)) {
          const uploadedImage = await uploadOriginalFile(item.image, 'site-setting/country');
          if (!uploadedImage) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload certificate image');
          }
          item.image = uploadedImage;
        }

        return item;
      })
    );
  }
  return normalizeMetaInformation(payload, 'site-setting');
};

const createOrUpdateSetting = async (data) => {
  const payload = await buildSettingPayload(data);
  const existingSetting = await SiteSettingModel.findOne();
  if (!existingSetting) {
    return SiteSettingModel.create(payload);
  }

  return SiteSettingModel.findByIdAndUpdate(existingSetting._id, payload, {
    new: true,
    runValidators: true,
  });
};

const getSiteSettingDetails = async () => {
  const siteSetting = await SiteSettingModel.findOne();
  if (!siteSetting) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Site setting details not found');
  }
  return addBaseUrlToPublicPaths(siteSetting);
};


module.exports = {
  createOrUpdateSetting,
  getSiteSettingDetails,
};
