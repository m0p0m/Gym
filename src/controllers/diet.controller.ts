import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import dietService from '../services/diet.service';

class DietController {
  public createDietPlan = catchAsync(async (req: Request, res: Response) => {
    const creatorId = req.user!._id; // User creating the plan must be a nutritionist/trainer
    const plan = await dietService.createDietPlan({ ...req.body, creatorId });
    res.status(httpStatus.CREATED).send(plan);
  });

  public assignPlanToUser = catchAsync(async (req: Request, res: Response) => {
    const { planId, userId } = req.body;
    const session = await dietService.assignPlanToUser(planId, userId);
    res.status(httpStatus.OK).send(session);
  });

  public logAdherence = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const { date, followed } = req.body;
    const session = await dietService.logDietAdherence(userId, date, followed);
    res.status(httpStatus.OK).send(session);
  });
}

export default new DietController();
