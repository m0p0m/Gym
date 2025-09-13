import request from 'supertest';
import httpStatus from 'http-status';
import app from '../src/index';
import User from '../src/models/user.model';
import Role from '../src/models/role.model';
import Permission from '../src/models/permission.model';
import OTP from '../src/models/otp.model';
import Product from '../src/models/product.model';

describe('Product Routes', () => {
  let adminToken: string;
  let adminUser: any;

  const productPayload = {
    name: 'Whey Protein',
    description: 'High quality whey protein isolate.',
    price: 50,
    stockQuantity: 100,
    category: 'Protein',
  };

  beforeEach(async () => {
    await User.deleteMany({});
    await Role.deleteMany({});
    await Permission.deleteMany({});
    await OTP.deleteMany({});
    await Product.deleteMany({});

    const adminPermissions = await Permission.insertMany([
      { name: 'products:create', description: 'desc' },
      { name: 'products:update', description: 'desc' },
      { name: 'products:delete', description: 'desc' },
    ]);
    const adminRole = await Role.create({ name: 'Admin', permissions: adminPermissions.map(p => p._id) });

    adminUser = await User.create({ phoneNumber: '0912ADMINPROD', role: adminRole._id, firstName: 'Prod', lastName: 'Admin' });
    const otpAdmin = await OTP.create({ phoneNumber: '0912ADMINPROD', otp: '1234' });
    const resAdmin = await request(app).post('/api/v1/auth/verify-otp').send({ phoneNumber: '0912ADMINPROD', otp: otpAdmin.otp });
    adminToken = resAdmin.body.tokens.access.token;
  });

  describe('POST /api/v1/products', () => {
    it('should allow an admin to create a product', async () => {
      await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productPayload)
        .expect(httpStatus.CREATED);
    });
  });

  describe('GET /api/v1/products', () => {
    it('should return a list of products', async () => {
      await Product.create(productPayload);
      const res = await request(app)
        .get('/api/v1/products')
        .expect(httpStatus.OK);

      expect(res.body.products).toHaveLength(1);
      expect(res.body.products[0].name).toBe(productPayload.name);
    });
  });
});
