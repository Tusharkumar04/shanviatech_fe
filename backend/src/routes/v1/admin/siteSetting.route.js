const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const siteSettingValidation = require('../../../validations/siteSetting.validation');
const siteSettingController = require('../../../controllers/admin/siteSetting.controller');

router.post('/create-or-update', validate(siteSettingValidation.createOrUpdateSetting), siteSettingController.createOrUpdateSetting);
router.get('/details', validate(siteSettingValidation.getSiteSettingDetails), siteSettingController.getSiteSettingDetails);

module.exports = router;
