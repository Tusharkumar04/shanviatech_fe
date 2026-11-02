const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const serviceService = require('../../services/service.service');

const createOrUpdateService = catchAsync(async (req, res) => {
  const data = await serviceService.createOrUpdateService(req.body);
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Service content saved successfully',
    data,
  });
});

const getServiceDetails = catchAsync(async (req, res) => {
  const data = await serviceService.getServiceDetails();
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Service details fetched successfully',
    data,
  });
});

module.exports = {
  createOrUpdateService,
  getServiceDetails,
};
