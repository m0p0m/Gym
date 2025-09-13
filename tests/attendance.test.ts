import request from 'supertest';
import httpStatus from 'http-status';
import app from '../src/index';
import User from '../src/models/user.model';
import Role from '../src/models/role.model';
import OTP from '../src/models/otp.model';
import Attendance from '../src/models/attendance.model';
import config from '../src/config';

describe('Attendance Routes', () => {
  let userToken: string;
  let user: any;
  const apiKey = config.apiKey;

  beforeEach(async () => {
    await User.deleteMany({});
    await Role.deleteMany({});
    await OTP.deleteMany({});
    await Attendance.deleteMany({});

    const userRole = await Role.create({ name: 'User', permissions: [] });
    user = await User.create({ phoneNumber: '0912ATTEND1', role: userRole._id, firstName: 'Att', lastName: 'User' });
    const otp = await OTP.create({ phoneNumber: '0912ATTEND1', otp: '1234' });
    const res = await request(app).post('/api/v1/auth/verify-otp').send({ phoneNumber: '0912ATTEND1', otp: otp.otp });
    userToken = res.body.tokens.access.token;
  });

  describe('POST /api/v1/attendance/check-in', () => {
    it('should fail with an invalid API key', async () => {
      await request(app)
        .post('/api/v1/attendance/check-in')
        .set('x-api-key', 'invalid-key')
        .send({ userIdentifier: user.phoneNumber })
        .expect(httpStatus.UNAUTHORIZED);
    });

    it('should allow check-in with a valid API key', async () => {
      await request(app)
        .post('/api/v1/attendance/check-in')
        .set('x-api-key', apiKey)
        .send({ userIdentifier: user.phoneNumber })
        .expect(httpStatus.CREATED);

      const attendance = await Attendance.findOne({ user: user._id });
      expect(attendance).toBeDefined();
      expect(attendance?.checkOutTime).toBeUndefined();
    });
  });

  describe('GET /api/v1/attendance/me', () => {
    it('should get the attendance history for the logged-in user', async () => {
      await Attendance.create({ user: user._id, checkInTime: new Date() });

      const res = await request(app)
        .get('/api/v1/attendance/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(httpStatus.OK);

      expect(res.body).toHaveLength(1);
      expect(res.body[0].user).toBe(user._id.toString());
    });
  });
});
