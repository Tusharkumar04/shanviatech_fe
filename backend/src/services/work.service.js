const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const WorkModel = require('../models/work.model');
const { uploadOriginalFile } = require('../middlewares/localFileUpload.middleware');
const { normalizeMetaInformation } = require('./helpers/metaInformation.helper');
const { addBaseUrlToPublicPaths } = require('./helpers/fileUrl.helper');

const shouldUpload = (value) => Boolean(value && typeof value === 'object' && value.file);

const buildWorkPayload = async (data) => {
  const payload = { ...data };

  if (shouldUpload(payload.image)) {
    const uploadedImage = await uploadOriginalFile(payload.image, 'work/image');
    if (!uploadedImage) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload work image');
    }
    payload.image = uploadedImage;
  }

  if (payload.our_process && typeof payload.our_process === 'object') {
    const ourProcess = { ...payload.our_process };
    if (shouldUpload(ourProcess.icon)) {
      const uploadedIcon = await uploadOriginalFile(ourProcess.icon, 'work/our-process-icon');
      if (!uploadedIcon) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload work process icon');
      }
      ourProcess.icon = uploadedIcon;
    }
    payload.our_process = ourProcess;
  }

  return normalizeMetaInformation(payload, 'work');
};

const createOrUpdateWork = async (data) => {
  const payload = await buildWorkPayload(data);
  const existingWork = await WorkModel.findOne();
  if (!existingWork) {
    return WorkModel.create(payload);
  }

  return WorkModel.findByIdAndUpdate(existingWork._id, payload, {
    new: true,
    runValidators: true,
  });
};

const getWorkDetails = async () => {
  const work = await WorkModel.findOne();
  if (!work) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Work details not found');
  }
  return addBaseUrlToPublicPaths(work);
};

module.exports = {
  createOrUpdateWork,
  getWorkDetails,
};
