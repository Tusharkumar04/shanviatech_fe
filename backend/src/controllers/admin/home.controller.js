const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const homeService = require('../../services/home.service');

const createOrUpdateHome = catchAsync(async (req, res) => {
  const data = await homeService.createOrUpdateHome(req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Home content saved successfully',
    data,
  });
});

const getHomeDetails = catchAsync(async (req, res) => {
  const data = await homeService.getHomeDetails();
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Home details fetched successfully',
    data,
  });
});

module.exports = {
  createOrUpdateHome,
  getHomeDetails,
};
