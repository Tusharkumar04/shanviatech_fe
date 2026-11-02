const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const jobApplicationService = require('../../services/jobApplication.service');

const buildFilter = (params = {}, query = {}) => {
  const filter = params.jobApplicationId ? { _id: params.jobApplicationId } : { ...query };
  if (filter.meta_slug) {
    filter['metaInformation.slug'] = filter.meta_slug;
    delete filter.meta_slug;
  }
  return filter;
};

const createJobApplication = catchAsync(async (req, res) => {
  const data = await jobApplicationService.createJobApplication(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Successfully created job application',
    data,
  });
});

const updateJobApplication = catchAsync(async (req, res) => {
  const data = await jobApplicationService.updateJobApplication(req.params.jobApplicationId, req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully updated job application',
    data,
  });
});

const deleteJobApplication = catchAsync(async (req, res) => {
  const data = await jobApplicationService.deleteJobApplication(req.params.jobApplicationId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully deleted job application',
    data,
  });
});

const getJobApplicationDetails = catchAsync(async (req, res) => {
  const filter = buildFilter(req.params, req.query);
  const data = await jobApplicationService.getJobApplicationDetails(filter);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Job application details fetched successfully',
    data,
  });
});

const getJobApplicationList = catchAsync(async (req, res) => {
  const { page, limit, sort, ...queryFilter } = req.query;
  const filter = buildFilter({}, queryFilter);
  const data = await jobApplicationService.getJobApplicationList(filter, { page, limit, sort });
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Job application list fetched successfully',
    data,
  });
});

module.exports = {
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
  getJobApplicationDetails,
  getJobApplicationList,
};
