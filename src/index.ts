import express, { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import config from './config';
import connectDB from './database/connection';
import v1Routes from './routes/v1';
import { ApiError } from './utils/ApiError';

const app = express();
const port = config.port;

// Connect to Database
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
});

// handle error
app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode, message } = err;
  res.status(statusCode).send({
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app; // Export for testing purposes
