const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const surveyQueryValidation = require('../../../validations/surveyQuery.validation');
const surveyQueryController = require('../../../controllers/admin/surveyQuery.controller');

// Public (popup) — flat list, reference response envelope.
router.get('/cms-list', surveyQueryController.getCmsList);

// Admin authoring.
router.get('/parents', surveyQueryController.getParents);
router.post('/', validate(surveyQueryValidation.createSurveyQuery), surveyQueryController.createSurveyQuery);
router.put('/:surveyQueryId', validate(surveyQueryValidation.updateSurveyQuery), surveyQueryController.updateSurveyQuery);
router.delete('/:surveyQueryId', validate(surveyQueryValidation.deleteSurveyQuery), surveyQueryController.deleteSurveyQuery);
router.get('/details/:surveyQueryId?', validate(surveyQueryValidation.getSurveyQueryDetails), surveyQueryController.getSurveyQueryDetails);
router.get('/list', validate(surveyQueryValidation.getSurveyQueryList), surveyQueryController.getSurveyQueryList);

module.exports = router;
