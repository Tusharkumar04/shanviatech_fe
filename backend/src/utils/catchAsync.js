const getLoggerAndLogError = require('./winston');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    const statusCode = err?.statusCode || 500;
    const message = err?.message || 'Something went wrong';
    const body = Object.keys(req?.body || {}).length
      ? req.body
      : Object.keys(req?.query || {}).length
      ? req.query
      : Object.keys(req?.params || {}).length
      ? req.params
      : '';
    getLoggerAndLogError(statusCode, body, message);
    next(err);
  });
};

module.exports = catchAsync;
