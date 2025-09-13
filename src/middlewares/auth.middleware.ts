import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import tokenService, { tokenTypes } from '../services/token.service';
import User, { IUser } from '../models/user.model';

// Extend the Express Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const auth = () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }

    const token = authHeader.substring(7); // Remove 'Bearer '
    const payload = await tokenService.verifyToken(token);

    if (typeof payload === 'string' || payload.type !== tokenTypes.ACCESS) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid access token');
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'User not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    // Handle specific errors like TokenExpiredError
    if (error instanceof jwt.TokenExpiredError) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Token expired'));
    }
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
};

export default auth;
