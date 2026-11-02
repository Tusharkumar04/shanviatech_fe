const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const TestimonialModel = require('../models/testimonial.model');
const { uploadOriginalFile } = require('../middlewares/localFileUpload.middleware');
const { normalizeMetaInformation } = require('./helpers/metaInformation.helper');
const { addBaseUrlToPublicPaths } = require('./helpers/fileUrl.helper');

const shouldUpload = (value) => Boolean(value && typeof value === 'object' && value.file);

const buildTestimonialPayload = async (data) => {
  const payload = { ...data };

  if (shouldUpload(payload.author_image)) {
    const uploadedImage = await uploadOriginalFile(payload.author_image, 'testimonial');
    if (!uploadedImage) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload testimonial author image');
    }
    payload.author_image = uploadedImage;
  }

  return normalizeMetaInformation(payload, 'testimonial');
};

const createTestimonial = async (data) => {
  const payload = await buildTestimonialPayload(data);
  return TestimonialModel.create(payload);
};

const updateTestimonial = async (testimonialId, data) => {
  const payload = await buildTestimonialPayload(data);
  const updatedTestimonial = await TestimonialModel.findByIdAndUpdate(testimonialId, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedTestimonial) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Testimonial not found');
  }

  return updatedTestimonial;
};

const getTestimonialDetails = async (filter = {}) => {
  const testimonial = await TestimonialModel.findOne(filter);
  if (!testimonial) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Testimonial details not found');
  }
  return addBaseUrlToPublicPaths(testimonial);
};

const getTestimonialList = async (filter = {}, options = {}) => {
  const page = Math.max(parseInt(options.page, 10) || 1, 1);
  const limit = Math.max(parseInt(options.limit, 10) || 10, 1);
  const sort = options.sort || 'order createdAt';
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    TestimonialModel.find(filter).sort(sort).skip(skip).limit(limit),
    TestimonialModel.countDocuments(filter),
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

const deleteTestimonial = async (testimonialId) => {
  const deletedTestimonial = await TestimonialModel.findByIdAndDelete(testimonialId);
  if (!deletedTestimonial) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Testimonial not found');
  }

  return deletedTestimonial;
};

module.exports = {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTestimonialDetails,
  getTestimonialList,
};
