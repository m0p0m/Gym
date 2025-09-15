import request from 'supertest';
import httpStatus from 'http-status';
import app from '../src/index';
import User from '../src/models/user.model';
import Role from '../src/models/role.model';
import OTP from '../src/models/otp.model';
import Product from '../src/models/product.model';
import Order from '../src/models/order.model';
import Cart from '../src/models/cart.model';

describe('Order Routes', () => {
  let userToken: string;
  let user: any;
  let product: any;

  beforeEach(async () => {
    await User.deleteMany({});
    await Role.deleteMany({});
    await OTP.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});

    const userRole = await Role.create({ name: 'User', description: 'desc', permissions: [] });
    user = await User.create({ phoneNumber: '09129876543', role: userRole._id, firstName: 'Order', lastName: 'User' });
    const otp = await OTP.create({ phoneNumber: '09129876543', otp: '1234' });
    const res = await request(app).post('/api/v1/auth/verify-otp').send({ phoneNumber: '09129876543', otp: otp.otp });
    userToken = res.body.tokens.access.token;

    product = await Product.create({ name: 'Order Product', price: 25, stockQuantity: 10, category: 'Test' });
    // Add item to cart
    await request(app).post('/api/v1/cart/items').set('Authorization', `Bearer ${userToken}`).send({ productId: product._id, quantity: 2 });
  });

  describe('POST /api/v1/orders', () => {
    it('should create an order from the cart', async () => {
      const shippingAddress = {
        street: '123 Main St',
        city: 'Tehran',
        postalCode: '12345',
      };
      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ shippingAddress })
        .expect(httpStatus.CREATED);

      expect(res.body.totalAmount).toBe(50); // 2 * 25
      expect(res.body.items[0].product).toBe(product._id.toString());

      const updatedProduct = await Product.findById(product._id);
      expect(updatedProduct?.stockQuantity).toBe(8); // 10 - 2

      const cart = await Cart.findOne({ user: user._id });
      expect(cart?.items).toHaveLength(0);
    });
  });
});
