import request from 'supertest';
import httpStatus from 'http-status';
import app from '../src/index';
import User from '../src/models/user.model';
import Role from '../src/models/role.model';
import Permission from '../src/models/permission.model';
import OTP from '../src/models/otp.model';
import Order from '../src/models/order.model';
import Subscription from '../src/models/subscription.model';

describe('Dashboard Routes', () => {
  let adminToken: string;

  beforeEach(async () => {
    // Clean up
    await User.deleteMany({});
    await Role.deleteMany({});
    await Permission.deleteMany({});
    await OTP.deleteMany({});
    await Order.deleteMany({});
    await Subscription.deleteMany({});

    // Create roles and permissions
    const adminPermissions = await Permission.insertMany([
      { name: 'dashboard:read', description: 'desc' },
    ]);
    const adminRole = await Role.create({ name: 'Admin', description: 'desc', permissions: adminPermissions.map(p => p._id) });
    const userRole = await Role.create({ name: 'User', description: 'desc', permissions: [] });

    // Create users
    const adminUser = await User.create({ phoneNumber: '0912ADMIN DASH', role: adminRole._id, firstName: 'Dash', lastName: 'Admin' });
    await User.create({ phoneNumber: '0912USERDASH1', role: userRole._id, firstName: 'Dash', lastName: 'User1' });
    await User.create({ phoneNumber: '0912USERDASH2', role: userRole._id, firstName: 'Dash', lastName: 'User2' });

    // Create subscriptions
    await Subscription.create({ user: adminUser._id, status: 'active', plan: new Role()._id, startDate: new Date(), endDate: new Date() });

    // Create orders
    await Order.create({ user: adminUser._id, totalAmount: 100, items: [], shippingAddress: { street: 'a', city: 'b', postalCode: 'c' } });
    await Order.create({ user: adminUser._id, totalAmount: 50, items: [], shippingAddress: { street: 'a', city: 'b', postalCode: 'c' } });

    // Login admin
    const otpAdmin = await OTP.create({ phoneNumber: '0912ADMIN DASH', otp: '1234' });
    const resAdmin = await request(app).post('/api/v1/auth/verify-otp').send({ phoneNumber: '0912ADMIN DASH', otp: otpAdmin.otp });
    adminToken = resAdmin.body.tokens.access.token;
  });

  describe('GET /api/v1/dashboard/stats', () => {
    it('should return dashboard statistics for an admin', async () => {
      const res = await request(app)
        .get('/api/v1/dashboard/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        totalUsers: 3,
        activeSubscriptions: 1,
        totalRevenue: 150,
        totalOrders: 2,
      });
    });
  });
});
