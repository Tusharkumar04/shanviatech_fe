const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const ProjectModel = require('../models/project.model');
const { uploadOriginalFile } = require('../middlewares/localFileUpload.middleware');
const { normalizeMetaInformation } = require('./helpers/metaInformation.helper');
const { addBaseUrlToPublicPaths } = require('./helpers/fileUrl.helper');

const shouldUpload = (value) => Boolean(value && typeof value === 'object' && value.file);

const buildProjectPayload = async (data) => {
  const payload = { ...data };

  if (shouldUpload(payload.image)) {
    const uploadedImage = await uploadOriginalFile(payload.image, 'project/image');
    if (!uploadedImage) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload project image');
    }
    payload.image = uploadedImage;
  }

  return normalizeMetaInformation(payload, 'project');
};

const createProject = async (data) => {
  const payload = await buildProjectPayload(data);
  return ProjectModel.create(payload);
};

const updateProject = async (projectId, data) => {
  const payload = await buildProjectPayload(data);
  const updatedProject = await ProjectModel.findByIdAndUpdate(projectId, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedProject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  return updatedProject;
};

const getProjectDetails = async (filter = {}) => {
  const project = await ProjectModel.findOne(filter);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project details not found');
  }
  return addBaseUrlToPublicPaths(project);
};

const getProjectList = async (filter = {}, options = {}) => {
  const page = Math.max(parseInt(options.page, 10) || 1, 1);
  const limit = Math.max(parseInt(options.limit, 10) || 10, 1);
  const sort = options.sort || 'order createdAt';
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    ProjectModel.find(filter).sort(sort).skip(skip).limit(limit),
    ProjectModel.countDocuments(filter),
  ]);

  return addBaseUrlToPublicPaths({
    items,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

const deleteProject = async (projectId) => {
  const deletedProject = await ProjectModel.findByIdAndDelete(projectId);
  if (!deletedProject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  return deletedProject;
};

module.exports = {
  createProject,
  updateProject,
  deleteProject,
  getProjectDetails,
  getProjectList,
};
