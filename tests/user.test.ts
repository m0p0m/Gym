import request from 'supertest';
import httpStatus from 'http-status';
import app from '../src/index';
import OTP from '../src/modules/auth/otp.model';
import User from '../src/modules/user/user.model';
import Role from '../src/modules/role/role.model';

describe('User Profile Routes', () => {
  let token: string;
  const phoneNumber = '09123334455';

  beforeEach(async () => {
    // Clean up and set up a logged-in user for each test
    await User.deleteMany({});
    await Role.deleteMany({});
    await OTP.deleteMany({});

    await Role.create({ name: 'User', description: 'Test role' });
    const otpDoc = await OTP.create({ phoneNumber, otp: '1234' });

    const res = await request(app)
      .post('/api/v1/auth/verify-otp')
      .send({ phoneNumber, otp: otpDoc.otp });

    token = res.body.tokens.access.token;
  });

  describe('GET /api/v1/users/me', () => {
    it('should return 401 UNAUTHORIZED if no access token is provided', async () => {
      await request(app)
        .get('/api/v1/users/me')
        .expect(httpStatus.UNAUTHORIZED);
    });

    it('should return 200 OK and the user profile for a logged-in user', async () => {
      const res = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(httpStatus.OK);

      expect(res.body).toHaveProperty('phoneNumber', phoneNumber);
      expect(res.body).toHaveProperty('firstName', 'New'); // Default name
    });
  });

  describe('PATCH /api/v1/users/me', () => {
    const updatePayload = {
      firstName: 'Jules',
      lastName: 'The Engineer',
      height: 180,
      weight: 80,
    };

    it('should return 401 UNAUTHORIZED if no access token is provided', async () => {
      await request(app)
        .patch('/api/v1/users/me')
        .send(updatePayload)
        .expect(httpStatus.UNAUTHORIZED);
    });

    it('should return 400 BAD REQUEST for invalid update data', async () => {
      await request(app)
        .patch('/api/v1/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ height: 'not-a-number' })
        .expect(httpStatus.BAD_REQUEST);
    });

    it('should return 200 OK and update the user profile', async () => {
      const res = await request(app)
        .patch('/api/v1/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send(updatePayload)
        .expect(httpStatus.OK);

      expect(res.body.firstName).toBe('Jules');
      expect(res.body.lastName).toBe('The Engineer');
      expect(res.body.height).toBe(180);

      const dbUser = await User.findOne({ phoneNumber });
      expect(dbUser?.firstName).toBe('Jules');
    });
  });
});
