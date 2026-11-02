const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const projectValidation = require('../../../validations/project.validation');
const projectController = require('../../../controllers/admin/project.controller');

router.post('/', validate(projectValidation.createProject), projectController.createProject);
router.put('/:projectId', validate(projectValidation.updateProject), projectController.updateProject);
router.delete('/:projectId', validate(projectValidation.deleteProject), projectController.deleteProject);
router.get('/details/:projectId?', validate(projectValidation.getProjectDetails), projectController.getProjectDetails);
router.get('/list', validate(projectValidation.getProjectList), projectController.getProjectList);

module.exports = router;
