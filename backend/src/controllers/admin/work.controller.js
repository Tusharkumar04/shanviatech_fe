const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const workService = require('../../services/work.service');

const createOrUpdateWork = catchAsync(async (req, res) => {
  const data = await workService.createOrUpdateWork(req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Work content saved successfully',
    data,
  });
});

const getWorkDetails = catchAsync(async (req, res) => {
  const data = await workService.getWorkDetails();
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Work details fetched successfully',
    data,
  });
});

module.exports = {
  createOrUpdateWork,
  getWorkDetails,
};
