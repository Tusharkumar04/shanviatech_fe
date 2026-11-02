const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const ProductModel = require('../models/products.model');
const { uploadOriginalFile } = require('../middlewares/localFileUpload.middleware');
const { normalizeMetaInformation } = require('./helpers/metaInformation.helper');
const { addBaseUrlToPublicPaths } = require('./helpers/fileUrl.helper');

const shouldUpload = (value) => Boolean(value && typeof value === 'object' && value.file);

const buildProductPayload = async (data) => {
  const payload = await normalizeMetaInformation(data, 'product');
  if (payload?.description) {
    payload.description = payload.description.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  }

  if (Array.isArray(payload.images)) {
    payload.images = await Promise.all(
      payload.images.map(async (image) => {
        if (!shouldUpload(image)) {
          return image;
        }
        const uploadedImage = await uploadOriginalFile(image, 'product/images');
        if (!uploadedImage) {
          throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload product image');
        }
        return uploadedImage;
      })
    );
  }

  return payload;
};

const createProduct = async (data) => {
  const payload = await buildProductPayload(data);
  return addBaseUrlToPublicPaths(await ProductModel.create(payload));
};

const updateProduct = async (productId, data) => {
  const payload = await buildProductPayload(data);
  const updatedProduct = await ProductModel.findByIdAndUpdate(productId, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  return addBaseUrlToPublicPaths(updatedProduct);
};

const getProductDetails = async (productId) => {
  const filter = productId ? { _id: productId } : {};
  const product = await ProductModel.findOne(filter);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product details not found');
  }
  return addBaseUrlToPublicPaths(product);
};

const getProductList = async (filter = {}, options = {}) => {
  const page = Math.max(parseInt(options.page, 10) || 1, 1);
  const limit = Math.max(parseInt(options.limit, 10) || 10, 1);
  const sort = options.sort || '-createdAt';
  const skip = (page - 1) * limit;

  if (options.search) {
    const regex = new RegExp(options.search, 'i');
    filter.$or = [{ title: regex }, { subtitle: regex }, { description: regex }];
  }

  const [items, total] = await Promise.all([
    ProductModel.find(filter).sort(sort).skip(skip).limit(limit),
    ProductModel.countDocuments(filter),
  ]);

  return addBaseUrlToPublicPaths({
    items,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

const deleteProduct = async (productId) => {
  const deletedProduct = await ProductModel.findByIdAndDelete(productId);
  if (!deletedProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  return deletedProduct;
};

module.exports = {
  createProduct,
  updateProduct,
  getProductDetails,
  getProductList,
  deleteProduct,
};