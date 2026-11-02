const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const surveyResponseValidation = require('../../../validations/surveyResponse.validation');
const surveyResponseController = require('../../../controllers/admin/surveyResponse.controller');

// Public (popup) — reference response envelope.
router.post('/create-or-update', validate(surveyResponseValidation.createOrUpdate), surveyResponseController.createOrUpdate);
router.get('/get-responses', validate(surveyResponseValidation.getResponses), surveyResponseController.getResponses);

// Admin inbox.
router.post('/multi-delete', validate(surveyResponseValidation.multiDeleteSurveyResponse), surveyResponseController.multiDeleteSurveyResponse);
router.get('/list', validate(surveyResponseValidation.getSurveyResponseList), surveyResponseController.getSurveyResponseList);
router.get('/details/:surveyResponseId', validate(surveyResponseValidation.getSurveyResponseDetails), surveyResponseController.getSurveyResponseDetails);
router.delete('/:surveyResponseId', validate(surveyResponseValidation.deleteSurveyResponse), surveyResponseController.deleteSurveyResponse);

module.exports = router;
