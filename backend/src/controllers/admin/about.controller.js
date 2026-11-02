const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const aboutService = require('../../services/about.service');

const createAbout = catchAsync(async (req, res) => {
  const data = await aboutService.createAbout(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Successfully created about',
    data,
  });
});

const getAboutDetails = catchAsync(async (req, res) => {
  const data = await aboutService.getAboutDetails();
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'About details fetched successfully',
    data,
  });
});

module.exports = {
  createAbout,
  getAboutDetails,
};
