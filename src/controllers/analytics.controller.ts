import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import analyticsService from '../services/analytics.service';

class AnalyticsController {
  public getStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await analyticsService.getDashboardStats();
    res.status(httpStatus.OK).send(stats);
  });
}

export default new AnalyticsController();
