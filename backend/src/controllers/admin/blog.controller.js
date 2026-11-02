const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const blogService = require('../../services/blog.service');

const buildFilter = (params = {}, query = {}) => {
  const filter = params.slug ? { slug: params.slug } : { ...query };
  if (filter.meta_slug) {
    filter['metaInformation.slug'] = filter.meta_slug;
    delete filter.meta_slug;
  }
  return filter;
};

const createBlog = catchAsync(async (req, res) => {
  const data = await blogService.createBlog(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Successfully created blog',
    data,
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const data = await blogService.updateBlog(req.params.blogId, req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully updated blog',
    data,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  const data = await blogService.deleteBlog(req.params.blogId);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Successfully deleted blog',
    data,
  });
});

const getBlogDetails = catchAsync(async (req, res) => {
  const filter = buildFilter(req.params, req.query);
  const data = await blogService.getBlogDetails(filter);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Blog details fetched successfully',
    data,
  });
});

const getBlogList = catchAsync(async (req, res) => {
  const { page, limit, sort, ...queryFilter } = req.query;
  const filter = buildFilter({}, queryFilter);
  const data = await blogService.getBlogList(filter, { page, limit, sort });
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Blog list fetched successfully',
    data,
  });
});

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogDetails,
  getBlogList,
};
