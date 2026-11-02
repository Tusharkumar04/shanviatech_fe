const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const aboutValidation = require('../../../validations/about.validation');
const aboutController = require('../../../controllers/admin/about.controller');

router.post('/create-or-update', validate(aboutValidation.createAbout), aboutController.createAbout);
router.get('/details', validate(aboutValidation.getAboutDetails), aboutController.getAboutDetails);

module.exports = router;
