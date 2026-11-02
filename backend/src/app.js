
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const userRoutes = require('./routes/v1/user.route');
const { errorConverter, errorHandler } = require('./middlewares/error');
const { methodLimiter } = require('./middlewares/rateLimiter');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const basicAuth = require('express-basic-auth');

const { createNamespace } = require('cls-hooked');

const namespace = createNamespace('app');

const app = express();

// Behind nginx/load balancer: trust the first proxy hop so the real client IP
// (X-Forwarded-For) is used as the rate-limit key instead of the proxy's IP.
app.set('trust proxy', 1);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shanvia Tech Solutions Pvt Ltd API Documentation',
      description: 'This is the API documentation for Shanvia Tech Solutions application.',
      version: '1.0.0',
      contact: {
        email: 'admin@shanviatech.com',
      },
      license: {
        name: 'Apache 2.0',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
      },
    },
    components: {
      securitySchemes: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
    },
    security: [
      {
        Bearer: [],
      },
    ],
    servers: [
      {
        url: 'http://localhost:3001/v1',
        description: 'This url is for local server',
      },
    ],
  },
  apis: [
    'src/routes/v1/user.route.js',
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.use(helmet());

app.use(express.json({ limit: '700mb' }));

app.use(
  express.urlencoded({
    extended: true,
    limit: '700mb',
    parameterLimit: 1000,
  })
);

app.use((req, res, next) => {
  namespace.run(() => {
    namespace.set('requestUrl', req.protocol + '://' + req.get('host') + req.originalUrl);
    next();
  });
});

app.use(compression());

// Browser Origin headers carry no trailing slash, so normalize the env list to match.
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((url) => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use('/public', express.static(path.join(__dirname, '../public')));

// Global per-method rate limiting. Mounted after static assets so image bursts
// on a page load don't consume the GET budget, and before all routes below.
app.use(methodLimiter);

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.use(
  '/api-docs',
  basicAuth({ users: { [process.env.SWAGGER_USERNAME]: process.env.SWAGGER_PASSWORD }, challenge: true }),
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocs)
);

app.use('/api/v1', userRoutes);

app.use('/', function (req, res) {
  res.status(200).json({
    statusCode: 200,
    message: 'Blank URL',
  });
});

app.use(errorConverter);

app.use(errorHandler);
module.exports = app;
