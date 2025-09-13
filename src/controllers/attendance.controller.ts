import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import attendanceService from '../services/attendance.service';

class AttendanceController {
  public checkIn = catchAsync(async (req: Request, res: Response) => {
    const { userIdentifier } = req.body;
    const attendance = await attendanceService.checkIn(userIdentifier);
    res.status(httpStatus.CREATED).send(attendance);
  });

  public checkOut = catchAsync(async (req: Request, res: Response) => {
    const { userIdentifier } = req.body;
    const attendance = await attendanceService.checkOut(userIdentifier);
    res.status(httpStatus.OK).send(attendance);
  });

  public getMyAttendance = catchAsync(async (req: Request, res: Response) => {
    const history = await attendanceService.getAttendanceHistory(req.user!._id);
    res.status(httpStatus.OK).send(history);
  });
}

export default new AttendanceController();
