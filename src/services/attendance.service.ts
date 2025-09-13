import httpStatus from 'http-status';
import { ApiError } from '../utils/ApiError';
import Attendance from '../models/attendance.model';
import User, { IUser } from '../models/user.model';
import { Types } from 'mongoose';

class AttendanceService {
  /**
   * Check a user in. Creates a new attendance record.
   * @param {string} userIdentifier - Can be phone number or a specific member ID
   * @returns {Promise<any>}
   */
  public async checkIn(userIdentifier: string): Promise<any> {
    // For this example, we assume the identifier is the phone number.
    const user = await User.findOne({ phoneNumber: userIdentifier });
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Optional: Check if user has an active subscription before allowing check-in
    // const activeSub = await Subscription.findOne({ user: user._id, status: 'active' });
    // if (!activeSub) {
    //   throw new ApiError(httpStatus.FORBIDDEN, 'User does not have an active subscription');
    // }

    // Optional: Prevent duplicate check-ins
    const existingCheckIn = await Attendance.findOne({ user: user._id, checkOutTime: { $exists: false } });
    if (existingCheckIn) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User is already checked in.');
    }

    const attendance = await Attendance.create({
      user: user._id,
      checkInTime: new Date(),
    });
    return attendance;
  }

  /**
   * Check a user out. Finds the last open attendance record and updates it.
   * @param {string} userIdentifier
   * @returns {Promise<any>}
   */
  public async checkOut(userIdentifier: string): Promise<any> {
    const user = await User.findOne({ phoneNumber: userIdentifier });
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const attendanceRecord = await Attendance.findOneAndUpdate(
      { user: user._id, checkOutTime: { $exists: false } },
      { $set: { checkOutTime: new Date() } },
      { new: true }
    );

    if (!attendanceRecord) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No open check-in found for this user.');
    }
    return attendanceRecord;
  }

  /**
   * Get attendance history for a user
   * @param {IUser['_id']} userId
   * @returns {Promise<any>}
   */
  public async getAttendanceHistory(userId: IUser['_id']): Promise<any> {
    return Attendance.find({ user: userId }).sort({ checkInTime: -1 });
  }
}

export default new AttendanceService();
