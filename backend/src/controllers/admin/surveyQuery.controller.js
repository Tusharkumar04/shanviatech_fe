const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const surveyQueryService = require('../../services/surveyQuery.service');

const buildFilter = (params = {}, query = {}) => {
  return params.surveyQueryId ? { _id: params.surveyQueryId } : { ...query };
};

const createSurveyQuery = catchAsync(async (req, res) => {
  const data = await surveyQueryService.createSurveyQuery(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Successfully created survey query',
    data,
  });
});

const updateSurveyQuery = catchAsync(async (req, res) => {
  const data = await surveyQueryService.updateSurveyQuery(req.params.surveyQueryId, req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully updated survey query',
    data,
  });
});

const deleteSurveyQuery = catchAsync(async (req, res) => {
  const data = await surveyQueryService.deleteSurveyQuery(req.params.surveyQueryId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully deleted survey query',
    data,
  });
});

const getSurveyQueryDetails = catchAsync(async (req, res) => {
  const filter = buildFilter(req.params, req.query);
  const data = await surveyQueryService.getSurveyQueryDetails(filter);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Survey query details fetched successfully',
    data,
  });
});

const getSurveyQueryList = catchAsync(async (req, res) => {
  const { page, limit, sort, ...queryFilter } = req.query;
  const filter = buildFilter({}, queryFilter);
  const data = await surveyQueryService.getSurveyQueryList(filter, { page, limit, sort });
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Survey query list fetched successfully',
    data,
  });
});

const getParents = catchAsync(async (req, res) => {
  const data = await surveyQueryService.getParents();
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Survey query parents fetched successfully',
    data,
  });
});

// Public endpoint for the popup — reference response envelope.
const getCmsList = catchAsync(async (req, res) => {
  const details = await surveyQueryService.getPublicList();
  res.status(httpStatus.OK).send({
    errorCode: 0,
    statusCode: httpStatus.OK,
    details,
  });
});

module.exports = {
  createSurveyQuery,
  updateSurveyQuery,
  deleteSurveyQuery,
  getSurveyQueryDetails,
  getSurveyQueryList,
  getParents,
  getCmsList,
};
