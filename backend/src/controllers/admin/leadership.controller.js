const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const leadershipService = require('../../services/leadership.service');

const buildFilter = (params = {}, query = {}) => {
  const filter = params.leadershipId ? { _id: params.leadershipId } : { ...query };
  if (filter.meta_slug) {
    filter['metaInformation.slug'] = filter.meta_slug;
    delete filter.meta_slug;
  }
  return filter;
};

const createLeadership = catchAsync(async (req, res) => {
  const data = await leadershipService.createLeadership(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Successfully created leadership',
    data,
  });
});

const updateLeadership = catchAsync(async (req, res) => {
  const data = await leadershipService.updateLeadership(req.params.leadershipId, req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully updated leadership',
    data,
  });
});

const deleteLeadership = catchAsync(async (req, res) => {
  const data = await leadershipService.deleteLeadership(req.params.leadershipId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully deleted leadership',
    data,
  });
});

const getLeadershipDetails = catchAsync(async (req, res) => {
  const filter = buildFilter(req.params, req.query);
  const data = await leadershipService.getLeadershipDetails(filter);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Leadership details fetched successfully',
    data,
  });
});

const getLeadershipList = catchAsync(async (req, res) => {
  const { page, limit, sort, ...queryFilter } = req.query;
  const filter = buildFilter({}, queryFilter);
  const data = await leadershipService.getLeadershipList(filter, { page, limit, sort });
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Leadership list fetched successfully',
    data,
  });
});

module.exports = {
  createLeadership,
  updateLeadership,
  deleteLeadership,
  getLeadershipDetails,
  getLeadershipList,
};
