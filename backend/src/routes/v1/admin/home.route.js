const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const homeValidation = require('../../../validations/home.validation');
const homeController = require('../../../controllers/admin/home.controller');

router.post('/create-or-update', validate(homeValidation.createOrUpdateHome), homeController.createOrUpdateHome);
router.get('/details', validate(homeValidation.getHomeDetails), homeController.getHomeDetails);

module.exports = router;
