import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import userService from '../services/user.service';

class UserController {
  public getProfile = catchAsync(async (req: Request, res: Response) => {
    // req.user is populated by the auth middleware
    const user = await userService.getUserById(req.user!._id);
    res.send(user);
  });

  public updateProfile = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.updateUserById(req.user!._id, req.body);
    res.send(user);
  });
}

export default new UserController();
