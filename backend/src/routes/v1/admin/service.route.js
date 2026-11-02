const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const serviceValidation = require('../../../validations/service.validation');
const serviceController = require('../../../controllers/admin/service.controller');

router.post('/create-or-update', validate(serviceValidation.createOrUpdateService), serviceController.createOrUpdateService);
router.get('/details', validate(serviceValidation.getServiceDetails), serviceController.getServiceDetails);

module.exports = router;
