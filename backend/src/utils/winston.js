const path = require('path');
const fs = require('fs');
const winston = require('winston');
const moment = require('moment');
const { getNamespace } = require('cls-hooked');

// Try to load the optional rotating-file transport; fall back to a plain file
// transport when the package isn't installed (silences the
// "DailyRotateFile is not a constructor" error in dev).
let DailyRotateFile = null;
try {
  require('winston-daily-rotate-file');
  if (typeof winston.transports.DailyRotateFile === 'function') {
    DailyRotateFile = winston.transports.DailyRotateFile;
  }
} catch (_) {
  /* optional dep not installed — falling back */
}

const LOG_DIR = 'errorlogs';

const buildTransport = () => {
  if (DailyRotateFile) {
    return new DailyRotateFile({
      filename: 'error-file-of-%DATE%.log',
      datePattern: 'DD-MM-YYYY',
      maxSize: '20m',
      maxFiles: '30d',
      dirname: LOG_DIR,
    });
  }

  // Fallback: a single file per day, rotation skipped (only the rotate
  // package supports that). Good enough for local dev.
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  } catch (_) {
    /* ignore — winston will surface any write error itself */
  }
  return new winston.transports.File({
    filename: path.join(LOG_DIR, `error-file-of-${moment().format('DD-MM-YYYY')}.log`),
    maxsize: 20 * 1024 * 1024,
    maxFiles: 30,
  });
};

// Build the logger once — recreating a writable stream on every error is
// expensive and was the root cause of the noisy logs.
let cachedLogger;
const getLogger = () => {
  if (!cachedLogger) {
    cachedLogger = winston.createLogger({ transports: [buildTransport()] });
  }
  return cachedLogger;
};

const getLoggerAndLogError = async (statusCode, body, errorMessage) => {
  try {
    let apiUrl = '';
    try {
      apiUrl = getNamespace('app')?.get('requestUrl') || '';
    } catch (_) {
      /* no active namespace — leave url blank */
    }

    getLogger().error(
      `Status Code: ${statusCode} on ${moment().format(
        'Do MMMM YYYY, h:mm:ss a'
      )}, Request Object: ${JSON.stringify(body)}, API Url: ${apiUrl}, Error Message: ${errorMessage}`
    );
  } catch (error) {
    console.log('Error in getLoggerAndLogError: ', error);
  }
};

module.exports = getLoggerAndLogError;
