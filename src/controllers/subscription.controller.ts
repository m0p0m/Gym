import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import subscriptionService from '../services/subscription.service';

class SubscriptionController {
  public createPlan = catchAsync(async (req: Request, res: Response) => {
    const plan = await subscriptionService.createSubscriptionPlan(req.body);
    res.status(httpStatus.CREATED).send(plan);
  });

  public assignSubscription = catchAsync(async (req: Request, res: Response) => {
    const { userId, planId } = req.body;
    const subscription = await subscriptionService.assignSubscriptionToUser(userId, planId);
    res.status(httpStatus.OK).send(subscription);
  });

  public getMySubscription = catchAsync(async (req: Request, res: Response) => {
    const subscription = await subscriptionService.getUserSubscription(req.user!._id);
    res.status(httpStatus.OK).send(subscription);
  });
}

export default new SubscriptionController();
