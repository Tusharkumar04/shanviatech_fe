const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const testimonialService = require('../../services/testimonial.service');

const buildFilter = (params = {}, query = {}) => {
  const filter = params.testimonialId ? { _id: params.testimonialId } : { ...query };
  if (filter.meta_slug) {
    filter['metaInformation.slug'] = filter.meta_slug;
    delete filter.meta_slug;
  }
  return filter;
};

const createTestimonial = catchAsync(async (req, res) => {
  const data = await testimonialService.createTestimonial(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Successfully created testimonial',
    data,
  });
});

const updateTestimonial = catchAsync(async (req, res) => {
  const data = await testimonialService.updateTestimonial(req.params.testimonialId, req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully updated testimonial',
    data,
  });
});

const deleteTestimonial = catchAsync(async (req, res) => {
  const data = await testimonialService.deleteTestimonial(req.params.testimonialId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully deleted testimonial',
    data,
  });
});

const getTestimonialDetails = catchAsync(async (req, res) => {
  const filter = buildFilter(req.params, req.query);
  const data = await testimonialService.getTestimonialDetails(filter);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Testimonial details fetched successfully',
    data,
  });
});

const getTestimonialList = catchAsync(async (req, res) => {
  const { page, limit, sort, ...queryFilter } = req.query;
  const filter = buildFilter({}, queryFilter);
  const data = await testimonialService.getTestimonialList(filter, { page, limit, sort });
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Testimonial list fetched successfully',
    data,
  });
});

module.exports = {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTestimonialDetails,
  getTestimonialList,
};
