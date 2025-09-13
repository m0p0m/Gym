import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { ApiError } from '../utils/ApiError';
import config from '../config';

const apiKeyAuth = () => (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header('x-api-key');
  if (!apiKey || apiKey !== config.apiKey) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or missing API Key'));
  }
  next();
};

export default apiKeyAuth;
