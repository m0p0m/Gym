import request from 'supertest';
import httpStatus from 'http-status';
import app from '../src/index';
import User from '../src/models/user.model';
import Role from '../src/models/role.model';
import Permission from '../src/models/permission.model';
import OTP from '../src/models/otp.model';
import DietPlan from '../src/models/dietPlan.model';

describe('Diet Routes', () => {
  let trainerToken: string;
  let trainer: any;

  const dietPlanPayload = {
    name: 'Weight Loss Diet',
    totalCalories: 2000,
    days: [
      {
        dayNumber: 1,
        meals: [
          {
            name: 'Breakfast',
            time: '08:00',
            items: [{ name: 'Oats', quantity: '1 cup', calories: 300 }],
          },
        ],
      },
    ],
  };

  beforeEach(async () => {
    await User.deleteMany({});
    await Role.deleteMany({});
    await OTP.deleteMany({});
    await DietPlan.deleteMany({});

    const dietPermissions = await Permission.insertMany([
      { name: 'diets:create', description: 'desc' },
      { name: 'diets:assign', description: 'desc' }
    ]);
    const trainerRole = await Role.create({ name: 'Nutritionist', description: 'desc', permissions: dietPermissions.map(p => p._id) });

    trainer = await User.create({ phoneNumber: '09121234567', role: trainerRole._id, firstName: 'Diet', lastName: 'Trainer' });
    const otpTrainer = await OTP.create({ phoneNumber: '09121234567', otp: '1234' });
    const resTrainer = await request(app).post('/api/v1/auth/verify-otp').send({ phoneNumber: '09121234567', otp: otpTrainer.otp });
    trainerToken = resTrainer.body.tokens.access.token;
  });

  describe('POST /api/v1/diets/plans', () => {
    it('should allow an authorized user to create a diet plan', async () => {
      const res = await request(app)
        .post('/api/v1/diets/plans')
        .set('Authorization', `Bearer ${trainerToken}`)
        .send(dietPlanPayload)
        .expect(httpStatus.CREATED);

      expect(res.body).toHaveProperty('name', dietPlanPayload.name);
      const dbPlan = await DietPlan.findById(res.body._id);
      expect(dbPlan).toBeDefined();
    });
  });
});
