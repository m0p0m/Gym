import request from 'supertest';
import httpStatus from 'http-status';
import app from '../src/index';
import User from '../src/database/models/user.model';
import Role from '../src/database/models/role.model';

describe('Auth Routes', () => {
  let userRole: any;
  const userData = {
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: '09876543210',
    password: 'password123',
  };

  beforeEach(async () => {
    // We need to ensure the 'User' role exists for registration to work
    userRole = await Role.create({ name: 'User', description: 'Test role', permissions: [] });
  });

  describe('POST /api/auth/register', () => {
    it('should create a new user and return 201 CREATED', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(httpStatus.CREATED);

      expect(res.body).not.toHaveProperty('password');
      expect(res.body.phoneNumber).toBe(userData.phoneNumber);

      const dbUser = await User.findById(res.body._id);
      expect(dbUser).toBeDefined();
    });

    it('should return 400 BAD REQUEST if phone number is already taken', async () => {
      await User.create({ ...userData, role: userRole._id });

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a user to log in with
      await User.create({ ...userData, role: userRole._id });
    });

    it('should login successfully and return a token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ phoneNumber: userData.phoneNumber, password: userData.password })
        .expect(httpStatus.OK);

      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.phoneNumber).toBe(userData.phoneNumber);
    });

    it('should return 401 UNAUTHORIZED for incorrect password', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({ phoneNumber: userData.phoneNumber, password: 'wrongpassword' })
        .expect(httpStatus.UNAUTHORIZED);
    });
  });
});
