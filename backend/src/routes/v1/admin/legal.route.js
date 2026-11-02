const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const legalValidation = require('../../../validations/legal.validation');
const legalController = require('../../../controllers/admin/legal.controller');

router.post('/', validate(legalValidation.createLegal), legalController.createLegal);
router.put('/:legalId', validate(legalValidation.updateLegal), legalController.updateLegal);
router.delete('/:legalId', validate(legalValidation.deleteLegal), legalController.deleteLegal);
router.get('/details/:type?', validate(legalValidation.getLegalDetails), legalController.getLegalDetails);
router.get('/list', validate(legalValidation.getLegalList), legalController.getLegalList);

module.exports = router;
