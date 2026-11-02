const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const testimonialValidation = require('../../../validations/testimonial.validation');
const testimonialController = require('../../../controllers/admin/testimonial.controller');

router.post('/', validate(testimonialValidation.createTestimonial), testimonialController.createTestimonial);
router.put('/:testimonialId', validate(testimonialValidation.updateTestimonial), testimonialController.updateTestimonial);
router.delete('/:testimonialId', validate(testimonialValidation.deleteTestimonial), testimonialController.deleteTestimonial);
router.get('/details/:testimonialId?', validate(testimonialValidation.getTestimonialDetails), testimonialController.getTestimonialDetails);
router.get('/list', validate(testimonialValidation.getTestimonialList), testimonialController.getTestimonialList);

module.exports = router;
