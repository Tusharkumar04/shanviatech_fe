const express = require('express');
const router = express.Router();
const validate = require('../../../middlewares/validate');
const productValidation = require('../../../validations/product.validation');
const productController = require('../../../controllers/admin/product.controller');

router.post('/', validate(productValidation.createProduct), productController.createProduct);
router.put('/:productId', validate(productValidation.updateProduct), productController.updateProduct);
router.delete('/:productId', validate(productValidation.deleteProduct), productController.deleteProduct);
router.get('/details/:productId?', validate(productValidation.getProductDetails), productController.getProductDetails);
router.get('/list', validate(productValidation.getProductList), productController.getProductList);

module.exports = router;