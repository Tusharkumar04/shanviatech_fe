const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const siteSettingService = require('../../services/siteSetting.service');

const createOrUpdateSetting = catchAsync(async (req, res) => {
  const data = await siteSettingService.createOrUpdateSetting(req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Site setting saved successfully',
    data,
  });
});

const getSiteSettingDetails = catchAsync(async (req, res) => {
  const data = await siteSettingService.getSiteSettingDetails();
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Site setting details fetched successfully',
    data,
  });
});

module.exports = {
  createOrUpdateSetting,
  getSiteSettingDetails,
};
