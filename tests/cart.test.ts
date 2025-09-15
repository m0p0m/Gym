import request from 'supertest';
import httpStatus from 'http-status';
import app from '../src/index';
import User from '../src/models/user.model';
import Role from '../src/models/role.model';
import OTP from '../src/models/otp.model';
import Product from '../src/models/product.model';
import Cart from '../src/models/cart.model';

describe('Cart Routes', () => {
  let userToken: string;
  let user: any;
  let product: any;

  beforeEach(async () => {
    await User.deleteMany({});
    await Role.deleteMany({});
    await OTP.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});

    const userRole = await Role.create({ name: 'User', description: 'desc', permissions: [] });
    user = await User.create({ phoneNumber: '09123456789', role: userRole._id, firstName: 'Cart', lastName: 'User' });
    const otp = await OTP.create({ phoneNumber: '09123456789', otp: '1234' });
    const res = await request(app).post('/api/v1/auth/verify-otp').send({ phoneNumber: '09123456789', otp: otp.otp });
    userToken = res.body.tokens.access.token;

    product = await Product.create({ name: 'Test Product', price: 10, stockQuantity: 5, category: 'Test' });
  });

  describe('POST /api/v1/cart/items', () => {
    it('should add an item to the cart', async () => {
      const res = await request(app)
        .post('/api/v1/cart/items')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: product._id, quantity: 2 })
        .expect(httpStatus.OK);

      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0].product._id).toBe(product._id.toString());
      expect(res.body.items[0].quantity).toBe(2);
    });
  });

  describe('GET /api/v1/cart', () => {
    it('should get the user cart', async () => {
      await request(app).post('/api/v1/cart/items').set('Authorization', `Bearer ${userToken}`).send({ productId: product._id, quantity: 1 });

      const res = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(httpStatus.OK);

      expect(res.body.items).toHaveLength(1);
    });
  });
});
