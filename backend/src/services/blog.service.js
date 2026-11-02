const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const BlogModel = require('../models/blog.model');
const { uploadOriginalFile } = require('../middlewares/localFileUpload.middleware');
const { normalizeMetaInformation } = require('./helpers/metaInformation.helper');
const { addBaseUrlToPublicPaths } = require('./helpers/fileUrl.helper');

const shouldUpload = (value) => Boolean(value && typeof value === 'object' && value.file);

const buildBlogPayload = async (data) => {
  const payload = { ...data };

  if (shouldUpload(payload.image)) {
    const uploadedImage = await uploadOriginalFile(payload.image, 'blog/image');
    if (!uploadedImage) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload blog image');
    }
    payload.image = uploadedImage;
  }

  return normalizeMetaInformation(payload, 'blog');
};

const createBlog = async (data) => {
  const payload = await buildBlogPayload(data);
  return BlogModel.create(payload);
};

const updateBlog = async (blogId, data) => {
  const payload = await buildBlogPayload(data);
  const updatedBlog = await BlogModel.findByIdAndUpdate(blogId, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedBlog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found');
  }

  return updatedBlog;
};

const getBlogDetails = async (filter = {}) => {
  const blog = await BlogModel.findOne(filter);
  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog details not found');
  }
  return addBaseUrlToPublicPaths(blog);
};

const getBlogList = async (filter = {}, options = {}) => {
  const page = Math.max(parseInt(options.page, 10) || 1, 1);
  const limit = Math.max(parseInt(options.limit, 10) || 10, 1);
  const sort = options.sort || '-createdAt';
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    BlogModel.find(filter).sort(sort).skip(skip).limit(limit),
    BlogModel.countDocuments(filter),
  ]);

  items.map((item) => {
    item._doc.author = {
      name: "Admin"
    }
    return item._doc;
  })

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

const deleteBlog = async (blogId) => {
  const deletedBlog = await BlogModel.findByIdAndDelete(blogId);
  if (!deletedBlog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found');
  }

  return deletedBlog;
};

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogDetails,
  getBlogList,
};
