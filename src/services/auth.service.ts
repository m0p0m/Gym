import httpStatus from 'http-status';
import User from '../database/models/user.model';
import Role from '../database/models/role.model';
import OTP from '../database/models/otp.model';
// A simple custom error class
import { ApiError } from '../utils/ApiError';

/**
 * Generate a random 4-digit OTP
 * @returns {string}
 */
const generateOtp = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

/**
 * Send an OTP to a user's phone number.
 * In a real app, this would use an SMS gateway.
 * @param {string} phoneNumber
 * @returns {Promise<string>} - The generated OTP for testing/logging purposes.
 */
const sendOtp = async (phoneNumber: string): Promise<string> => {
  const otp = generateOtp();
  // Save the OTP to the database, it will expire automatically
  await OTP.create({ phoneNumber, otp });

  // TODO: Integrate with an SMS provider like Twilio or Kavenegar
  console.log(`Generated OTP for ${phoneNumber}: ${otp}`);

  return otp;
};

/**
 * Verify an OTP and find or create a user.
 * @param {string} phoneNumber
 * @param {string} otp
 * @returns {Promise<User>}
 */
const verifyOtp = async (phoneNumber: string, otp: string) => {
  const otpDoc = await OTP.findOne({ phoneNumber, otp });

  if (!otpDoc) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid OTP or OTP expired');
  }

  // OTP is valid, so delete it to prevent reuse
  await otpDoc.deleteOne();

  let user = await User.findOne({ phoneNumber });

  // If user doesn't exist, create a new one
  if (!user) {
    const userRole = await Role.findOne({ name: 'User' });
    if (!userRole) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Default user role not found');
    }
    user = await User.create({
      // A default name is needed, user should update it in their profile
      firstName: 'New',
      lastName: 'User',
      phoneNumber,
      role: userRole._id,
    });
  }

  return user;
};

export default {
  sendOtp,
  verifyOtp,
};
