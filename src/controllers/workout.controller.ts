import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import workoutService from '../services/workout.service';

class WorkoutController {
  public createWorkoutPlan = catchAsync(async (req: Request, res: Response) => {
    const trainerId = req.user!._id; // Assuming the logged-in user is a trainer
    const plan = await workoutService.createWorkoutPlan({ ...req.body, trainerId });
    res.status(httpStatus.CREATED).send(plan);
  });

  public assignPlanToUser = catchAsync(async (req: Request, res: Response) => {
    const { planId, userId } = req.body;
    const session = await workoutService.assignPlanToUser(planId, userId);
    res.status(httpStatus.OK).send(session);
  });

  public getMyActivePlan = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const plan = await workoutService.getUserActivePlan(userId);
    res.status(httpStatus.OK).send(plan);
  });

  public completeDay = catchAsync(async (req: Request, res: Response) => {
    const { dayId, notes } = req.body;
    const session = await workoutService.completeWorkoutDay(req.user!._id, dayId, notes);
    res.status(httpStatus.OK).send(session);
  });
}

export default new WorkoutController();
