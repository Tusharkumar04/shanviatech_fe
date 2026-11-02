const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const caseStudyValidation = require('../../../validations/caseStudy.validation');
const caseStudyController = require('../../../controllers/admin/caseStudy.controller');

router.post('/', validate(caseStudyValidation.createCaseStudy), caseStudyController.createCaseStudy);
router.put('/:caseStudyId', validate(caseStudyValidation.updateCaseStudy), caseStudyController.updateCaseStudy);
router.delete('/:caseStudyId', validate(caseStudyValidation.deleteCaseStudy), caseStudyController.deleteCaseStudy);
router.get('/details/:caseStudyId?', validate(caseStudyValidation.getCaseStudyDetails), caseStudyController.getCaseStudyDetails);
router.get('/list', validate(caseStudyValidation.getCaseStudyList), caseStudyController.getCaseStudyList);

module.exports = router;
