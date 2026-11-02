const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const jobValidation = require('../../../validations/job.validation');
const jobController = require('../../../controllers/admin/job.controller');

router.post('/', validate(jobValidation.createJob), jobController.createJob);
router.put('/:jobId', validate(jobValidation.updateJob), jobController.updateJob);
router.delete('/:jobId', validate(jobValidation.deleteJob), jobController.deleteJob);
router.get('/details/:jobId?', validate(jobValidation.getJobDetails), jobController.getJobDetails);
router.get('/list', validate(jobValidation.getJobList), jobController.getJobList);

module.exports = router;
