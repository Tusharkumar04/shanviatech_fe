const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const jobApplicationValidation = require('../../../validations/jobApplication.validation');
const jobApplicationController = require('../../../controllers/admin/jobApplication.controller');

router.post('/', validate(jobApplicationValidation.createJobApplication), jobApplicationController.createJobApplication);
router.put('/:jobApplicationId', validate(jobApplicationValidation.updateJobApplication), jobApplicationController.updateJobApplication);
router.delete('/:jobApplicationId', validate(jobApplicationValidation.deleteJobApplication), jobApplicationController.deleteJobApplication);
router.get('/details/:jobApplicationId?', validate(jobApplicationValidation.getJobApplicationDetails), jobApplicationController.getJobApplicationDetails);
router.get('/list', validate(jobApplicationValidation.getJobApplicationList), jobApplicationController.getJobApplicationList);

module.exports = router;
