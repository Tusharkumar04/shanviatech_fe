const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const legalService = require('../../services/legal.service');

const buildFilter = (params = {}, query = {}) => {
  const filter = params.type ? { type: params.type } : { ...query };
  if (filter.meta_slug) {
    filter['metaInformation.slug'] = filter.meta_slug;
    delete filter.meta_slug;
  }
  return filter;
};

const createLegal = catchAsync(async (req, res) => {
  const data = await legalService.createLegal(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Successfully created legal content',
    data,
  });
});

const updateLegal = catchAsync(async (req, res) => {
  const data = await legalService.updateLegal(req.params.legalId, req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully updated legal content',
    data,
  });
});

const deleteLegal = catchAsync(async (req, res) => {
  const data = await legalService.deleteLegal(req.params.legalId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully deleted legal content',
    data,
  });
});

const getLegalDetails = catchAsync(async (req, res) => {
  const filter = buildFilter(req.params, req.query);
  const data = await legalService.getLegalDetails(filter);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Legal content details fetched successfully',
    data,
  });
});

const getLegalList = catchAsync(async (req, res) => {
  const { page, limit, sort, ...queryFilter } = req.query;
  const filter = buildFilter({}, queryFilter);
  const data = await legalService.getLegalList(filter, { page, limit, sort });
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Legal content list fetched successfully',
    data,
  });
});

module.exports = {
  createLegal,
  updateLegal,
  deleteLegal,
  getLegalDetails,
  getLegalList,
};
