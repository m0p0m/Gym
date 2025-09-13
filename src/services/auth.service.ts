import httpStatus from 'http-status';
import User from '../models/user.model';
import Role from '../models/role.model';
import OTP from '../models/otp.model';
import { ApiError } from '../utils/ApiError';

class AuthService {
  /**
   * Generate a random 4-digit OTP
   */
  private generateOtp(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  /**
   * Send an OTP to a user's phone number.
   */
  async sendOtp(phoneNumber: string): Promise<string> {
    const otp = this.generateOtp();
    await OTP.create({ phoneNumber, otp });
    console.log(`Generated OTP for ${phoneNumber}: ${otp}`);
    return otp;
  }

  /**
   * Verify an OTP and find or create a user.
   */
  async verifyOtp(phoneNumber: string, otp: string) {
    const otpDoc = await OTP.findOne({ phoneNumber, otp });
    if (!otpDoc) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid OTP or OTP expired');
    }
    await otpDoc.deleteOne();

    let user = await User.findOne({ phoneNumber });
    if (!user) {
      const userRole = await Role.findOne({ name: 'User' });
      if (!userRole) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Default user role not found');
      }
      user = await User.create({
        firstName: 'New',
        lastName: 'User',
        phoneNumber,
        role: userRole._id,
      });
    }
    return user;
  }
}

export default new AuthService();
