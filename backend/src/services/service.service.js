const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const ServiceModel = require('../models/service.mode');
const { uploadOriginalFile } = require('../middlewares/localFileUpload.middleware');
const { normalizeMetaInformation } = require('./helpers/metaInformation.helper');
const { addBaseUrlToPublicPaths } = require('./helpers/fileUrl.helper');

const shouldUpload = (value) => Boolean(value && typeof value === 'object' && value.file);

const uploadImageArray = async (value, folderName, errorMessage) => {
  if (!Array.isArray(value)) {
    return value;
  }

  return Promise.all(
    value.map(async (item) => {
      if (!shouldUpload(item)) {
        return item;
      }
      const uploadedImage = await uploadOriginalFile(item, folderName);
      if (!uploadedImage) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, errorMessage);
      }
      return uploadedImage;
    })
  );
};

const buildServicePayload = async (data) => {
  const payload = { ...data };

  if (Array.isArray(payload.services)) {
    payload.services = await Promise.all(
      payload.services.map(async (service) => {
        const item = { ...service };

        if (shouldUpload(item.image)) {
          const uploadedImage = await uploadOriginalFile(item.image, 'service/services');
          if (!uploadedImage) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload service image');
          }
          item.image = uploadedImage;
        }

        if (Array.isArray(item.highlights)) {
          item.highlights = await Promise.all(
            item.highlights.map(async (highlight) => {
              const highlightItem = { ...highlight };
              highlightItem.image = await uploadImageArray(
                highlightItem.image,
                'service/service-highlights',
                'Failed to upload service highlight image'
              );
              highlightItem.description = highlightItem.description ? highlightItem.description.replace(/&lt;/g, '<').replace(/&gt;/g, '>') : '';
              return highlightItem;
            })
          );
        }

        return item;
      })
    );
  }

  if (payload.agile_project && typeof payload.agile_project === 'object') {
    const agileProject = { ...payload.agile_project };
    if (shouldUpload(agileProject.image)) {
      const uploadedImage = await uploadOriginalFile(agileProject.image, 'service/agile-project');
      if (!uploadedImage) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload agile project image');
      }
      agileProject.image = uploadedImage;
    }
    payload.agile_project = agileProject;
  }

  if (Array.isArray(payload.digital_solutions)) {
    payload.digital_solutions = await Promise.all(
      payload.digital_solutions.map(async (solution) => {
        const solutionItem = { ...solution };
        if (Array.isArray(solutionItem.highlights)) {
          solutionItem.highlights = await Promise.all(
            solutionItem.highlights.map(async (highlight) => {
              const highlightItem = { ...highlight };
              if (shouldUpload(highlightItem.image)) {
                const uploadedImage = await uploadOriginalFile(highlightItem.image, 'service/digital-solutions');
                if (!uploadedImage) {
                  throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload digital solution image');
                }
                highlightItem.image = uploadedImage;
              }
              highlightItem.description = highlightItem.description ? highlightItem.description.replace(/&lt;/g, '<').replace(/&gt;/g, '>') : '';
              highlightItem.description2 = highlightItem.description2 ? highlightItem.description2.replace(/&lt;/g, '<').replace(/&gt;/g, '>') : '';
              return highlightItem;
            })
          );
        }
        return solutionItem;
      })
    );
  }

  if (payload.quality_assurance && typeof payload.quality_assurance === 'object') {
    const qualityAssurance = { ...payload.quality_assurance };
    if (shouldUpload(qualityAssurance.image)) {
      const uploadedImage = await uploadOriginalFile(qualityAssurance.image, 'service/quality-assurance');
      if (!uploadedImage) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload quality assurance image');
      }
      qualityAssurance.image = uploadedImage;
    }
    payload.quality_assurance = qualityAssurance;
  }

  return normalizeMetaInformation(payload, 'service');
};

const createOrUpdateService = async (data) => {
  const payload = await buildServicePayload(data);
  if (payload?.digital_experiences?.description) {
    payload.digital_experiences.description = payload?.digital_experiences?.description ? payload?.digital_experiences?.description.replace(/&lt;/g, '<').replace(/&gt;/g, '>') : '';
  }
  if (payload?.agile_project?.description) {
    payload.agile_project.description = payload.agile_project.description ? payload.agile_project.description.replace(/&lt;/g, '<').replace(/&gt;/g, '>') : '';
  }
  if (payload?.quality_assurance?.description) {
    payload.quality_assurance.description = payload.quality_assurance.description ? payload.quality_assurance.description.replace(/&lt;/g, '<').replace(/&gt;/g, '>') : '';
  }


  const existingService = await ServiceModel.findOne();
  if (!existingService) {
    return ServiceModel.create(payload);
  }

  return ServiceModel.findByIdAndUpdate(existingService._id, payload, {
    new: true,
    runValidators: true,
  });
};

const getServiceDetails = async () => {
  const service = await ServiceModel.findOne();
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service details not found');
  }
  return addBaseUrlToPublicPaths(service);
};

module.exports = {
  createOrUpdateService,
  getServiceDetails,
};
