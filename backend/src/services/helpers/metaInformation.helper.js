const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { uploadOriginalFile } = require('../../middlewares/localFileUpload.middleware');

const shouldUpload = (value) => Boolean(value && typeof value === 'object' && value.file);

const normalizeMetaInformation = async (payload = {}, folderName = 'common') => {
  if (!payload || typeof payload !== 'object' || !payload.metaInformation || typeof payload.metaInformation !== 'object') {
    return payload;
  }

  const normalizedPayload = { ...payload };
  const normalizedMeta = { ...normalizedPayload.metaInformation };

  if (typeof normalizedMeta.meta_keywords === 'string') {
    normalizedMeta.meta_keywords = normalizedMeta.meta_keywords
      .split(',')
      .map((keyword) => keyword.trim())
      .filter(Boolean);
  }

  if (shouldUpload(normalizedMeta.og_image)) {
    const uploadedOgImage = await uploadOriginalFile(normalizedMeta.og_image, `${folderName}/meta-information`);
    if (!uploadedOgImage) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload meta information og image');
    }
    normalizedMeta.og_image = uploadedOgImage;
  }

  normalizedPayload.metaInformation = normalizedMeta;

  return normalizedPayload;
};

module.exports = {
  normalizeMetaInformation,
};
