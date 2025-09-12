import request from 'supertest';
import httpStatus from 'http-status';
import app from '../src/index';
import User from '../src/models/user.model';
import Role from '../src/models/role.model';
import Permission from '../src/models/permission.model';
import OTP from '../src/models/otp.model';
import SubscriptionPlan from '../src/models/subscriptionPlan.model';
import Subscription from '../src/models/subscription.model';

describe('Subscription Routes', () => {
  let adminToken: string;
  let userToken: string;
  let adminUser: any;
  let regularUser: any;
  let plan: any;

  beforeEach(async () => {
    // Clean up
    await User.deleteMany({});
    await Role.deleteMany({});
    await Permission.deleteMany({});
    await OTP.deleteMany({});
    await SubscriptionPlan.deleteMany({});
    await Subscription.deleteMany({});

    // Create roles and permissions
    const adminPermissions = await Permission.insertMany([
      { name: 'subscriptions:create', description: 'desc' },
      { name: 'subscriptions:assign', description: 'desc' }
    ]);
    const adminRole = await Role.create({ name: 'Admin', permissions: adminPermissions.map(p => p._id) });
    const userRole = await Role.create({ name: 'User', permissions: [] });

    // Create and login admin
    adminUser = await User.create({ phoneNumber: '0912ADMIN11', role: adminRole._id, firstName: 'Test', lastName: 'Admin' });
    const otpAdmin = await OTP.create({ phoneNumber: '0912ADMIN11', otp: '1234' });
    const resAdmin = await request(app).post('/api/v1/auth/verify-otp').send({ phoneNumber: '0912ADMIN11', otp: otpAdmin.otp });
    adminToken = resAdmin.body.tokens.access.token;

    // Create and login regular user
    regularUser = await User.create({ phoneNumber: '0912USER222', role: userRole._id, firstName: 'Test', lastName: 'User' });
    const otpUser = await OTP.create({ phoneNumber: '0912USER222', otp: '1234' });
    const resUser = await request(app).post('/api/v1/auth/verify-otp').send({ phoneNumber: '0912USER222', otp: otpUser.otp });
    userToken = resUser.body.tokens.access.token;

    // Create a plan
    plan = await SubscriptionPlan.create({ name: 'Gold', price: 100, durationDays: 30 });
  });

  describe('POST /api/v1/subscriptions/plans', () => {
    it('should allow an admin to create a subscription plan', async () => {
      await request(app)
        .post('/api/v1/subscriptions/plans')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Silver', price: 50, durationDays: 30 })
        .expect(httpStatus.CREATED);
    });
  });

  describe('POST /api/v1/subscriptions', () => {
    it('should allow an admin to assign a subscription to a user', async () => {
      await request(app)
        .post('/api/v1/subscriptions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ planId: plan._id, userId: regularUser._id })
        .expect(httpStatus.OK);

      const sub = await Subscription.findOne({ user: regularUser._id });
      expect(sub).toBeDefined();
    });
  });

  describe('GET /api/v1/subscriptions/me', () => {
    it('should allow a user to get their own subscription', async () => {
      await request(app).post('/api/v1/subscriptions').set('Authorization', `Bearer ${adminToken}`).send({ planId: plan._id, userId: regularUser._id });

      const res = await request(app)
        .get('/api/v1/subscriptions/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(httpStatus.OK);

      expect(res.body.plan.name).toBe('Gold');
    });
  });
});
