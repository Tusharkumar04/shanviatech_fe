const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const cmsContentValidation = require('../../../validations/cmsContent.validation');
const cmsContentController = require('../../../controllers/admin/cmsContent.controller');

router.post('/create-or-update', validate(cmsContentValidation.createOrUpdateCmsContent), cmsContentController.createOrUpdateCmsContent);
router.get('/details', validate(cmsContentValidation.getCmsContentDetails), cmsContentController.getCmsContentDetails);

module.exports = router;
