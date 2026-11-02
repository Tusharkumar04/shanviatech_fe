const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const domainExpertiseValidation = require('../../../validations/domainExpertise.validation');
const domainExpertiseController = require('../../../controllers/admin/domainExpertise.controller');

router.post('/', validate(domainExpertiseValidation.createDomainExpertise), domainExpertiseController.createDomainExpertise);
router.put('/:domainExpertiseId', validate(domainExpertiseValidation.updateDomainExpertise), domainExpertiseController.updateDomainExpertise);
router.delete('/:domainExpertiseId', validate(domainExpertiseValidation.deleteDomainExpertise), domainExpertiseController.deleteDomainExpertise);
router.get('/details/:domainExpertiseId?', validate(domainExpertiseValidation.getDomainExpertiseDetails), domainExpertiseController.getDomainExpertiseDetails);
router.get('/list', validate(domainExpertiseValidation.getDomainExpertiseList), domainExpertiseController.getDomainExpertiseList);

module.exports = router;
