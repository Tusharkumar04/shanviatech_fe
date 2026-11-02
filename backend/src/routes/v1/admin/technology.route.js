const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const technologyValidation = require('../../../validations/technology.validation');
const technologyController = require('../../../controllers/admin/technology.controller');

router.post('/', validate(technologyValidation.createTechnology), technologyController.createTechnology);
router.put('/:technologyId', validate(technologyValidation.updateTechnology), technologyController.updateTechnology);
router.delete('/:technologyId', validate(technologyValidation.deleteTechnology), technologyController.deleteTechnology);
router.get('/details/:technologyId?', validate(technologyValidation.getTechnologyDetails), technologyController.getTechnologyDetails);
router.get('/list', validate(technologyValidation.getTechnologyList), technologyController.getTechnologyList);

module.exports = router;
