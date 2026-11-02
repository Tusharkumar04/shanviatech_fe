const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const cmsContentService = require('../../services/cmsContent.service');

const createOrUpdateCmsContent = catchAsync(async (req, res) => {
  const data = await cmsContentService.createOrUpdateCmsContent(req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Cms content saved successfully',
    data,
  });
});

const getCmsContentDetails = catchAsync(async (req, res) => {
  const data = await cmsContentService.getCmsContentDetails();
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Cms content details fetched successfully',
    data,
  });
});

module.exports = {
  createOrUpdateCmsContent,
  getCmsContentDetails,
};
