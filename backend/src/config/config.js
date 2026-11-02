const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3001).description('Port to run the server on'),
    HOSTNAME: Joi.string().default('localhost').description('Hostname for the server'),
    SSL: Joi.string().valid('true', 'false').default('false').description('Enable SSL for the server'),
    SSL_KEY_PATH: Joi.string().when('SSL', {
      is: 'true',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }).description('Path to the SSL key file'),
    SSL_CERT_PATH: Joi.string().when('SSL', {
      is: 'true',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }).description('Path to the SSL certificate file'),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_DAYS: Joi.number().default(30).description('days after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    S3_ACCESS_KEY: Joi.string().description('ACCESS KEY for AWS s3 bucket'),
    S3_SECRET_KEY: Joi.string().description('SECRET KEY for AWS s3 bucket'),
    S3_BUCKET: Joi.string().description('BUCKET NAME for AWS s3 bucket'),
    S3_REGION: Joi.string().description('BUCKET REGION for AWS s3 bucket'),
    // These tolerate '' so a placeholder .env line doesn't crash the server on
    // boot; blanks are coerced to undefined below and treated as "unconfigured".
    MSG91_AUTHKEY: Joi.string().allow('').description('MSG91 auth key for sending OTP SMS'),
    MSG91_TEMPLATE_ID: Joi.string().allow('').description('MSG91 OTP-route template id that renders the OTP'),
    MSG91_DEFAULT_COUNTRY_CODE: Joi.string().allow('').default('91').description('Country code used when the form omits one'),
    OTP_LENGTH: Joi.number().integer().min(4).max(8).default(6).description('Number of digits in a generated OTP'),
    OTP_EXPIRY_MINUTES: Joi.number().integer().min(1).default(10).description('Minutes an OTP stays valid'),
    OTP_MAX_ATTEMPTS: Joi.number().integer().min(1).default(5).description('Wrong guesses allowed before the OTP is burned'),
    OTP_RESEND_COOLDOWN_SECONDS: Joi.number().integer().min(0).default(60).description('Seconds a visitor must wait between sends'),
    OTP_PROOF_TTL_HOURS: Joi.number().integer().min(1).default(24).description('Hours a successful verification stays usable at submit time'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

/** Treat a blank env var as absent, so `if (!authKey)` checks behave. */
const blankToUndefined = (value) => (value === '' ? undefined : value);

module.exports = {
  hostname: envVars.HOSTNAME,
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  ssl: envVars.SSL === 'true' ? true : false,
  keyPath: envVars.SSL_KEY_PATH || '',
  certPath: envVars.SSL_CERT_PATH || '',
  // mongoose: {
  //   url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
  //   options: {
  //     useCreateIndex: true,
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //     useFindAndModify: false,
  //   },
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {},
  },

  jwt: {
  secret: envVars.JWT_SECRET,
    accessExpirationDays: envVars.JWT_ACCESS_EXPIRATION_DAYS,
      refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: 10,
  },
s3: {
  S3_ACCESS_KEY: envVars.S3_ACCESS_KEY,
    S3_SECRET_KEY: envVars.S3_SECRET_KEY,
      S3_BUCKET: envVars.S3_BUCKET,
        S3_REGION: envVars.S3_REGION,
  },
msg91: {
  authKey: blankToUndefined(envVars.MSG91_AUTHKEY),
    templateId: blankToUndefined(envVars.MSG91_TEMPLATE_ID),
      defaultCountryCode: blankToUndefined(envVars.MSG91_DEFAULT_COUNTRY_CODE) || '91',
  },
otp: {
  length: envVars.OTP_LENGTH,
    expiryMinutes: envVars.OTP_EXPIRY_MINUTES,
      maxAttempts: envVars.OTP_MAX_ATTEMPTS,
        resendCooldownSeconds: envVars.OTP_RESEND_COOLDOWN_SECONDS,
          proofTtlHours: envVars.OTP_PROOF_TTL_HOURS,
  },
};
