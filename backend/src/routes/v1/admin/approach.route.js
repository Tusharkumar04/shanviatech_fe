const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const approachValidation = require('../../../validations/approach.validation');
const approachController = require('../../../controllers/admin/approach.controller');

router.post('/create-or-update', validate(approachValidation.createOrUpdateApproach), approachController.createOrUpdateApproach);
router.get('/details', validate(approachValidation.getApproachDetails), approachController.getApproachDetails);

module.exports = router;
