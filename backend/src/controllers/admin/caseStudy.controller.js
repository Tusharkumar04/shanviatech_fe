const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const caseStudyService = require('../../services/caseStudy.service');

const buildFilter = (params = {}, query = {}) => {
  const filter = params.caseStudyId ? { _id: params.caseStudyId } : { ...query };
  if (filter.meta_slug) {
    filter['metaInformation.slug'] = filter.meta_slug;
    delete filter.meta_slug;
  }
  return filter;
};

const createCaseStudy = catchAsync(async (req, res) => {
  const data = await caseStudyService.createCaseStudy(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Successfully created case study',
    data,
  });
});

const updateCaseStudy = catchAsync(async (req, res) => {
  const data = await caseStudyService.updateCaseStudy(req.params.caseStudyId, req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully updated case study',
    data,
  });
});

const deleteCaseStudy = catchAsync(async (req, res) => {
  const data = await caseStudyService.deleteCaseStudy(req.params.caseStudyId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully deleted case study',
    data,
  });
});

const getCaseStudyDetails = catchAsync(async (req, res) => {
  const filter = buildFilter(req.params, req.query);
  const data = await caseStudyService.getCaseStudyDetails(filter);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Case study details fetched successfully',
    data,
  });
});

const getCaseStudyList = catchAsync(async (req, res) => {
  const { page, limit, sort, ...queryFilter } = req.query;
  const filter = buildFilter({}, queryFilter);
  const data = await caseStudyService.getCaseStudyList(filter, { page, limit, sort });
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Case study list fetched successfully',
    data,
  });
});

module.exports = {
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
  getCaseStudyDetails,
  getCaseStudyList,
};
