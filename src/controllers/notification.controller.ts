import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import notificationService from '../services/notification.service';
import { Types } from 'mongoose';

class NotificationController {
  public getMyNotifications = catchAsync(async (req: Request, res: Response) => {
    const notifications = await notificationService.getUserNotifications(req.user!._id);
    res.status(httpStatus.OK).send(notifications);
  });

  public markAsRead = catchAsync(async (req: Request, res: Response) => {
    const notification = await notificationService.markAsRead(new Types.ObjectId(req.params.notificationId), req.user!._id);
    res.status(httpStatus.OK).send(notification);
  });
}

export default new NotificationController();
