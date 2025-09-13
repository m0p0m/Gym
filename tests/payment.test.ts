import request from 'supertest';
import httpStatus from 'http-status';
import app from '../src/index';
import User from '../src/models/user.model';
import Role from '../src/models/role.model';
import OTP from '../src/models/otp.model';
import Product from '../src/models/product.model';
import Order from '../src/models/order.model';
import Cart from '../src/models/cart.model';
import Transaction from '../src/models/transaction.model';

// Mock the Zarinpal SDK
jest.mock('zarinpal-node-sdk', () => ({
  ZarinPal: jest.fn().mockImplementation(() => ({
    payments: {
      create: jest.fn().mockResolvedValue({
        result: { code: 100, authority: 'TEST_AUTHORITY' },
      }),
      getRedirectUrl: jest.fn().mockReturnValue('https://zarinpal.com/pg/TEST_AUTHORITY'),
    },
    verifications: {
      verify: jest.fn().mockResolvedValue({
        result: { code: 100, ref_id: 'TEST_REF_ID' },
      }),
    },
  })),
}));

describe('Payment Routes', () => {
  let userToken: string;
  let user: any;
  let order: any;

  beforeEach(async () => {
    // Clear all collections
    await User.deleteMany({});
    await Role.deleteMany({});
    await OTP.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    await Transaction.deleteMany({});

    const userRole = await Role.create({ name: 'User', permissions: [] });
    user = await User.create({ phoneNumber: '0912PAYMENT1', role: userRole._id });
    const otp = await OTP.create({ phoneNumber: '0912PAYMENT1', otp: '1234' });
    const res = await request(app).post('/api/v1/auth/verify-otp').send({ phoneNumber: '0912PAYMENT1', otp: otp.otp });
    userToken = res.body.tokens.access.token;

    order = await Order.create({
      user: user._id,
      items: [],
      totalAmount: 10000,
      status: 'pending',
      shippingAddress: { street: 'a', city: 'b', postalCode: 'c' },
    });
  });

  describe('POST /api/v1/payments/request/order/:orderId', () => {
    it('should create a payment request and return a payment URL', async () => {
      const res = await request(app)
        .post(`/api/v1/payments/request/order/${order._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(httpStatus.OK);

      expect(res.body).toHaveProperty('paymentUrl', 'https://zarinpal.com/pg/TEST_AUTHORITY');
      const transaction = await Transaction.findOne({ order: order._id });
      expect(transaction).toBeDefined();
      expect(transaction?.authority).toBe('TEST_AUTHORITY');
    });
  });

  describe('GET /api/v1/payments/callback', () => {
    it('should verify a successful payment and update the order status', async () => {
      await Transaction.create({ user: user._id, order: order._id, amount: 10000, authority: 'AUTH_TO_VERIFY' });

      const res = await request(app)
        .get('/api/v1/payments/callback?Authority=AUTH_TO_VERIFY&Status=OK')
        .expect(httpStatus.OK);

      expect(res.body.message).toBe('Payment verified successfully');
      const updatedOrder = await Order.findById(order._id);
      expect(updatedOrder?.status).toBe('paid');
    });
  });
});
