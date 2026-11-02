const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const approachService = require('../../services/approach.service');

const createOrUpdateApproach = catchAsync(async (req, res) => {
  const data = await approachService.createOrUpdateApproach(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Successfully created/updated approach',
    data,
  });
});

const getApproachDetails = catchAsync(async (req, res) => {
  const data = await approachService.getApproachDetails();
  res.status(httpStatus.OK).send({
    code: httpStatus.OK,
    message: 'Approach details fetched successfully',
    data,
  });
});

module.exports = {
  createOrUpdateApproach,
  getApproachDetails,
};
