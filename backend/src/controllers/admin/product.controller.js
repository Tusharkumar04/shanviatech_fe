const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const productService = require('../../services/product.service');

const createProduct = catchAsync(async (req, res) => {
  const data = await productService.createProduct(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Successfully created product',
    data,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const data = await productService.updateProduct(req.params.productId, req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully updated product',
    data,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const data = await productService.deleteProduct(req.params.productId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully deleted product',
    data,
  });
});



const getProductDetails = catchAsync(async (req, res) => {
  const data = await productService.getProductDetails(req.params.productId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Product details fetched successfully',
    data,
  });
});

const getProductList = catchAsync(async (req, res) => {
  const { page, limit, sort, search, ...queryFilter } = req.query;
  const data = await productService.getProductList(queryFilter, { page, limit, sort, search });
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Product list fetched successfully',
    data,
  });
});

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  getProductList,
};