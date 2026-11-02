const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const technologyService = require('../../services/technology.service');

const buildFilter = (params = {}, query = {}) => {
  const filter = params.technologyId ? { _id: params.technologyId } : { ...query };
  if (filter.meta_slug) {
    filter['metaInformation.slug'] = filter.meta_slug;
    delete filter.meta_slug;
  }
  return filter;
};

const createTechnology = catchAsync(async (req, res) => {
  const data = await technologyService.createTechnology(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Successfully created technology',
    data,
  });
});

const updateTechnology = catchAsync(async (req, res) => {
  const data = await technologyService.updateTechnology(req.params.technologyId, req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully updated technology',
    data,
  });
});

const deleteTechnology = catchAsync(async (req, res) => {
  const data = await technologyService.deleteTechnology(req.params.technologyId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully deleted technology',
    data,
  });
});

const getTechnologyDetails = catchAsync(async (req, res) => {
  const filter = buildFilter(req.params, req.query);
  const data = await technologyService.getTechnologyDetails(filter);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Technology details fetched successfully',
    data,
  });
});

const getTechnologyList = catchAsync(async (req, res) => {
  const { page, limit, sort, ...queryFilter } = req.query;
  const filter = buildFilter({}, queryFilter);
  const data = await technologyService.getTechnologyList(filter, { page, limit, sort });
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Technology list fetched successfully',
    data,
  });
});

module.exports = {
  createTechnology,
  updateTechnology,
  deleteTechnology,
  getTechnologyDetails,
  getTechnologyList,
};
