const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const domainExpertiseService = require('../../services/domainExpertise.service');

const buildFilter = (params = {}, query = {}) => {
  const filter = params.domainExpertiseId ? { _id: params.domainExpertiseId } : { ...query };
  if (filter.meta_slug) {
    filter['metaInformation.slug'] = filter.meta_slug;
    delete filter.meta_slug;
  }
  return filter;
};

const createDomainExpertise = catchAsync(async (req, res) => {
  const data = await domainExpertiseService.createDomainExpertise(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Successfully created domain expertise',
    data,
  });
});

const updateDomainExpertise = catchAsync(async (req, res) => {
  const data = await domainExpertiseService.updateDomainExpertise(req.params.domainExpertiseId, req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully updated domain expertise',
    data,
  });
});

const deleteDomainExpertise = catchAsync(async (req, res) => {
  const data = await domainExpertiseService.deleteDomainExpertise(req.params.domainExpertiseId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully deleted domain expertise',
    data,
  });
});

const getDomainExpertiseDetails = catchAsync(async (req, res) => {
  const filter = buildFilter(req.params, req.query);
  const data = await domainExpertiseService.getDomainExpertiseDetails(filter);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Domain expertise details fetched successfully',
    data,
  });
});

const getDomainExpertiseList = catchAsync(async (req, res) => {
  const { page, limit, sort, ...queryFilter } = req.query;
  const filter = buildFilter({}, queryFilter);
  const data = await domainExpertiseService.getDomainExpertiseList(filter, { page, limit, sort });
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Domain expertise list fetched successfully',
    data,
  });
});

module.exports = {
  createDomainExpertise,
  updateDomainExpertise,
  deleteDomainExpertise,
  getDomainExpertiseDetails,
  getDomainExpertiseList,
};
