const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const surveyResponseService = require('../../services/surveyResponse.service');

// ===== Public (popup) — reference response envelope =====

const createOrUpdate = catchAsync(async (req, res) => {
  const result = await surveyResponseService.createOrUpdate(req.body);
  res.status(httpStatus.OK).send(result);
});

const getResponses = catchAsync(async (req, res) => {
  const result = await surveyResponseService.getUserResponse(req.query.uid);
  res.status(httpStatus.OK).send(result);
});

// ===== Admin (React) — project response envelope =====

const getSurveyResponseList = catchAsync(async (req, res) => {
  const { page, limit, sort } = req.query;
  const data = await surveyResponseService.getList({}, { page, limit, sort });
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Survey response list fetched successfully',
    data,
  });
});

const getSurveyResponseDetails = catchAsync(async (req, res) => {
  const data = await surveyResponseService.getDetails({ _id: req.params.surveyResponseId });
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Survey response details fetched successfully',
    data,
  });
});

const deleteSurveyResponse = catchAsync(async (req, res) => {
  const data = await surveyResponseService.remove(req.params.surveyResponseId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully deleted survey response',
    data,
  });
});

const multiDeleteSurveyResponse = catchAsync(async (req, res) => {
  const data = await surveyResponseService.multiDelete(req.body.ids);
  res.status(httpStatus.OK).send({
    errorCode: 0,
    code: httpStatus.OK,
    message: 'Successfully deleted selected survey responses',
    data,
  });
});

module.exports = {
  createOrUpdate,
  getResponses,
  getSurveyResponseList,
  getSurveyResponseDetails,
  deleteSurveyResponse,
  multiDeleteSurveyResponse,
};
