const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const projectService = require('../../services/project.service');

const buildFilter = (params = {}, query = {}) => {
  const filter = params.projectId ? { _id: params.projectId } : { ...query };
  if (filter.meta_slug) {
    filter['metaInformation.slug'] = filter.meta_slug;
    delete filter.meta_slug;
  }
  return filter;
};

const createProject = catchAsync(async (req, res) => {
  const data = await projectService.createProject(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Successfully created project',
    data,
  });
});

const updateProject = catchAsync(async (req, res) => {
  const data = await projectService.updateProject(req.params.projectId, req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully updated project',
    data,
  });
});

const deleteProject = catchAsync(async (req, res) => {
  const data = await projectService.deleteProject(req.params.projectId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully deleted project',
    data,
  });
});

const getProjectDetails = catchAsync(async (req, res) => {
  const filter = buildFilter(req.params, req.query);
  const data = await projectService.getProjectDetails(filter);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Project details fetched successfully',
    data,
  });
});

const getProjectList = catchAsync(async (req, res) => {
  const { page, limit, sort, ...queryFilter } = req.query;
  const filter = buildFilter({}, queryFilter);
  const data = await projectService.getProjectList(filter, { page, limit, sort });
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Project list fetched successfully',
    data,
  });
});

module.exports = {
  createProject,
  updateProject,
  deleteProject,
  getProjectDetails,
  getProjectList,
};
