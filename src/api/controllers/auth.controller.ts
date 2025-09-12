import { Request, Response } from 'express';
import httpStatus from 'http-status';
import authService from '../../services/auth.service';
import tokenService from '../../services/token.service';
import User from '../../database/models/user.model';
import { tokenTypes } from '../../services/token.service';
import { ApiError } from '../../utils/ApiError';

// A simple wrapper to catch async errors
const catchAsync = (fn: Function) => (req: Request, res: Response, next: Function) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

const sendOtp = catchAsync(async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;
  const otp = await authService.sendOtp(phoneNumber);
  // In a real app, we wouldn't send the OTP in the response.
  // This is for testing purposes in an environment without SMS.
  res.status(httpStatus.OK).send({ message: 'OTP sent successfully.', otp });
});

const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const { phoneNumber, otp } = req.body;
  const user = await authService.verifyOtp(phoneNumber, otp);
  const tokens = await tokenService.generateAuthTokens(user);

  // Save the refresh token
  user.refreshTokens = user.refreshTokens || [];
  user.refreshTokens.push(tokens.refresh.token);
  await user.save();

  res.send({ user, tokens });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Refresh token is required');
  }

  const payload = await tokenService.verifyToken(refreshToken);
  if (typeof payload === 'string' || payload.type !== tokenTypes.REFRESH) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
  }

  const user = await User.findById(payload.sub).select('+refreshTokens');
  if (!user || !user.refreshTokens?.includes(refreshToken)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Refresh token not found or revoked');
  }

  // Optional: Implement token rotation by removing the old token
  user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);

  const tokens = await tokenService.generateAuthTokens(user);

  // Save the new refresh token
  user.refreshTokens.push(tokens.refresh.token);
  await user.save();

  res.send({ ...tokens });
});

export default {
  sendOtp,
  verifyOtp,
  refreshToken,
};
