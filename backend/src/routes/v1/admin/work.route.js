const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const workValidation = require('../../../validations/work.validation');
const workController = require('../../../controllers/admin/work.controller');

router.post('/create-or-update', validate(workValidation.createOrUpdateWork), workController.createOrUpdateWork);
router.get('/details', validate(workValidation.getWorkDetails), workController.getWorkDetails);

module.exports = router;
