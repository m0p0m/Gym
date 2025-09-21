import request from 'supertest';
import httpStatus from 'http-status';
import app from '../src/index';
import OTP from '../src/models/otp.model';
import User from '../src/models/user.model';
import Role from '../src/models/role.model';

describe('Auth Routes (OTP Flow)', () => {
  const phoneNumber = '09121112233';
  let validOtp: string;

  beforeEach(async () => {
    // Clean up database before each test
    await OTP.deleteMany({});
    await User.deleteMany({});
    await Role.deleteMany({});
    // We need the 'User' role to exist for user creation
    await Role.create({ name: 'User', description: 'Test role', permissions: [] });
  });

  describe('POST /api/v1/auth/send-otp', () => {
    it('should return 200 OK and create an OTP in the database', async () => {
      const res = await request(app)
        .post('/api/v1/auth/send-otp')
        .send({ phoneNumber })
        .expect(httpStatus.OK);

      expect(res.body).toHaveProperty('message', 'An OTP has been sent to your phone number.');
      expect(res.body).not.toHaveProperty('otp');

      const otpDoc = await OTP.findOne({ phoneNumber });
      expect(otpDoc).toBeDefined();
      expect(otpDoc?.otp).toHaveLength(4); // Check that an OTP was generated
    });
  });

  describe('POST /api/v1/auth/verify-otp', () => {
    beforeEach(async () => {
      // Create a valid OTP for testing verification
      const otpDoc = await OTP.create({ phoneNumber, otp: '1234' });
      validOtp = otpDoc.otp;
    });

    it('should return 401 UNAUTHORIZED for an invalid OTP', async () => {
      await request(app)
        .post('/api/v1/auth/verify-otp')
        .send({ phoneNumber, otp: '0000' })
        .expect(httpStatus.UNAUTHORIZED);
    });

    it('should create a new user if one does not exist and return tokens', async () => {
      const res = await request(app)
        .post('/api/v1/auth/verify-otp')
        .send({ phoneNumber, otp: validOtp })
        .expect(httpStatus.OK);

      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('tokens');
      expect(res.body.tokens).toHaveProperty('access');
      expect(res.body.tokens).toHaveProperty('refresh');
      expect(res.body.user.phoneNumber).toBe(phoneNumber);

      const dbUser = await User.findOne({ phoneNumber });
      expect(dbUser).toBeDefined();
    });

    it('should log in an existing user and return tokens', async () => {
      const userRole = await Role.findOne({ name: 'User' });
      await User.create({ phoneNumber, firstName: 'Existing', lastName: 'User', role: userRole?._id });

      const res = await request(app)
        .post('/api/v1/auth/verify-otp')
        .send({ phoneNumber, otp: validOtp })
        .expect(httpStatus.OK);

      expect(res.body.user.firstName).toBe('Existing');
    });
  });

  describe('POST /api/v1/auth/refresh-token', () => {
    let refreshToken: string;

    beforeEach(async () => {
      // Create a user and log them in to get a refresh token
      const otpDoc = await OTP.create({ phoneNumber, otp: '1234' });
      const verifyRes = await request(app)
        .post('/api/v1/auth/verify-otp')
        .send({ phoneNumber, otp: otpDoc.otp });

      refreshToken = verifyRes.body.tokens.refresh.token;
    });

    it('should return new tokens for a valid refresh token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken })
        .expect(httpStatus.OK);

      expect(res.body).toHaveProperty('access');
      expect(res.body).toHaveProperty('refresh');
    });

    it('should return 401 UNAUTHORIZED for an invalid refresh token', async () => {
      await request(app)
        .post('/api/v1/auth/refresh-token')
        .send({ refreshToken: 'invalidtoken' })
        .expect(httpStatus.UNAUTHORIZED);
    });
  });
});
