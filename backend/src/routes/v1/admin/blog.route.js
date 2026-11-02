const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const blogValidation = require('../../../validations/blog.validation');
const blogController = require('../../../controllers/admin/blog.controller');

router.post('/', validate(blogValidation.createBlog), blogController.createBlog);
router.put('/:blogId', validate(blogValidation.updateBlog), blogController.updateBlog);
router.delete('/:blogId', validate(blogValidation.deleteBlog), blogController.deleteBlog);
router.get('/details/:slug?', validate(blogValidation.getBlogDetails), blogController.getBlogDetails);
router.get('/list', validate(blogValidation.getBlogList), blogController.getBlogList);

module.exports = router;
