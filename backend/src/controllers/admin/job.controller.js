const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const jobService = require('../../services/job.service');

const buildFilter = (params = {}, query = {}) => {
  const filter = params.jobId ? { _id: params.jobId } : { ...query };
  if (filter.meta_slug) {
    filter['metaInformation.slug'] = filter.meta_slug;
    delete filter.meta_slug;
  }
  return filter;
};

const createJob = catchAsync(async (req, res) => {
  const data = await jobService.createJob(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Successfully created job',
    data,
  });
});

const updateJob = catchAsync(async (req, res) => {
  const data = await jobService.updateJob(req.params.jobId, req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully updated job',
    data,
  });
});

const deleteJob = catchAsync(async (req, res) => {
  const data = await jobService.deleteJob(req.params.jobId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully deleted job',
    data,
  });
});

const getJobDetails = catchAsync(async (req, res) => {
  const filter = buildFilter(req.params, req.query);
  const data = await jobService.getJobDetails(filter);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Job details fetched successfully',
    data,
  });
});

const getJobList = catchAsync(async (req, res) => {
  const { page, limit, sort, ...queryFilter } = req.query;
  const filter = buildFilter({}, queryFilter);
  const data = await jobService.getJobList(filter, { page, limit, sort });
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Job list fetched successfully',
    data,
  });
});

module.exports = {
  createJob,
  updateJob,
  deleteJob,
  getJobDetails,
  getJobList,
};
