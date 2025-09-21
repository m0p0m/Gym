import express, { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import config from './config';
import logger from './config/logger';
import connectDB from './database/connection';
import v1Routes from './routes/v1';
import { ApiError } from './utils/ApiError';

const app = express();
const port = config.port;

// Set security HTTP headers
app.use(helmet());

// Logging
if (config.env !== 'test') {
  app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
}

// Connect to Database, but not in test environment
if (config.env !== 'test') {
  connectDB();
}

// Middlewares
app.use(express.json({
  verify: (req, res, buf) => {
    // Save the raw body buffer onto the request object
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true }));

// Sanitize request data
app.use(mongoSanitize());

// Gzip compression
app.use(compression());

// Enable cors
app.use(cors());

// v1 API Routes
app.use('/api/v1', v1Routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || 'An unexpected error occurred.';
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
});

// handle error
app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode, message } = err;
  if (config.env === 'development') {
    logger.error(err);
  }
  res.status(statusCode).send({
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  });
});


// Start the server
app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});

export default app; // Export for testing purposes
