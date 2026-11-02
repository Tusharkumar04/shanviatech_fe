const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const leadershipValidation = require('../../../validations/leadership.validation');
const leadershipController = require('../../../controllers/admin/leadership.controller');

router.post('/', validate(leadershipValidation.createLeadership), leadershipController.createLeadership);
router.put('/:leadershipId', validate(leadershipValidation.updateLeadership), leadershipController.updateLeadership);
router.delete('/:leadershipId', validate(leadershipValidation.deleteLeadership), leadershipController.deleteLeadership);
router.get('/details/:leadershipId?', validate(leadershipValidation.getLeadershipDetails), leadershipController.getLeadershipDetails);
router.get('/list', validate(leadershipValidation.getLeadershipList), leadershipController.getLeadershipList);

module.exports = router;
