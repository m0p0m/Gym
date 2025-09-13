import { Request, Response } from 'express';
import httpStatus from 'http-status';
import authService from '../services/auth.service';
import tokenService, { tokenTypes } from '../services/token.service';
import User from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';

class AuthController {
  public sendOtp = catchAsync(async (req: Request, res: Response) => {
    const { phoneNumber } = req.body;
    const otp = await authService.sendOtp(phoneNumber);
    res.status(httpStatus.OK).send({ message: 'OTP sent successfully.', otp });
  });

  public verifyOtp = catchAsync(async (req: Request, res: Response) => {
    const { phoneNumber, otp } = req.body;
    const user = await authService.verifyOtp(phoneNumber, otp);
    const tokens = await tokenService.generateAuthTokens(user);

    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push(tokens.refresh.token);
    await user.save();

    res.send({ user, tokens });
  });

  public refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Refresh token is required');
    }

    const payload: any = await tokenService.verifyToken(refreshToken);
    if (payload.type !== tokenTypes.REFRESH) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
    }

    const user = await User.findById(payload.sub).select('+refreshTokens');
    if (!user || !user.refreshTokens?.includes(refreshToken)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Refresh token not found or revoked');
    }

    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);

    const tokens = await tokenService.generateAuthTokens(user);

    user.refreshTokens.push(tokens.refresh.token);
    await user.save();

    res.send({ ...tokens });
  });
}

export default new AuthController();
