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
    beforeEach(async () => {
      // Create a variety of products for filtering tests
      await Product.insertMany([
        { name: 'Whey Protein', description: 'A supplement for muscle growth', price: 50, category: 'Protein', brand: 'GymBrand' },
        { name: 'Creatine Monohydrate', description: 'A supplement for strength', price: 25, category: 'Performance', brand: 'GymBrand' },
        { name: 'Pre-Workout Fuel', description: 'Energy supplement', price: 35, category: 'Performance', brand: 'OtherBrand' },
      ]);
    });

    it('should return all products if no filter is specified', async () => {
      const res = await request(app)
        .get('/api/v1/products')
        .expect(httpStatus.OK);
      expect(res.body.products).toHaveLength(3);
    });

    it('should filter products by category', async () => {
      const res = await request(app)
        .get('/api/v1/products?category=Performance')
        .expect(httpStatus.OK);
      expect(res.body.products).toHaveLength(2);
      expect(res.body.products.every((p: any) => p.category === 'Performance')).toBe(true);
    });

    it('should filter products by brand', async () => {
      const res = await request(app)
        .get('/api/v1/products?brand=GymBrand')
        .expect(httpStatus.OK);
      expect(res.body.products).toHaveLength(2);
      expect(res.body.products.every((p: any) => p.brand === 'GymBrand')).toBe(true);
    });

    it('should filter by price range', async () => {
      const res = await request(app)
        .get('/api/v1/products?minPrice=30&maxPrice=40')
        .expect(httpStatus.OK);
      expect(res.body.products).toHaveLength(1);
      expect(res.body.products[0].name).toBe('Pre-Workout Fuel');
    });

    it('should perform a text search on name and description', async () => {
      const res = await request(app)
        .get('/api/v1/products?search=supplement')
        .expect(httpStatus.OK);
      expect(res.body.products).toHaveLength(2); // Whey and Creatine
    });
  });
});
