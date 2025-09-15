import request from 'supertest';
import httpStatus from 'http-status';
import app from '../src/index';
import User from '../src/models/user.model';
import Role from '../src/models/role.model';
import Permission from '../src/models/permission.model';
import OTP from '../src/models/otp.model';
import WorkoutPlan from '../src/models/workoutPlan.model';
import WorkoutDay from '../src/models/workoutDay.model';
import UserWorkoutSession from '../src/models/userWorkoutSession.model';

describe('Workout Routes', () => {
  let trainerToken: string;
  let userToken: string;
  let trainer: any;
  let regularUser: any;

  const workoutPlanPayload = {
    name: 'Beginner Strength',
    durationWeeks: 4,
    days: [
      {
        dayOfWeek: 'Monday',
        name: 'Full Body A',
        exercises: [{ exerciseName: 'Squat', sets: 3, reps: '8-12', restPeriodSeconds: 60 }],
      },
    ],
  };

  beforeEach(async () => {
    // Clean up
    await User.deleteMany({});
    await Role.deleteMany({});
    await OTP.deleteMany({});
    await WorkoutPlan.deleteMany({});
    await UserWorkoutSession.deleteMany({});

    // Create roles and permissions
    const permissions = await Permission.insertMany([
      { name: 'workouts:create', description: 'desc' },
      { name: 'workouts:assign', description: 'desc' }
    ]);
    const trainerRole = await Role.create({ name: 'Trainer', description: 'desc', permissions: permissions.map(p => p._id) });
    const userRole = await Role.create({ name: 'User', description: 'desc', permissions: [] });

    // Create and login trainer
    trainer = await User.create({ phoneNumber: '09120001111', role: trainerRole._id, firstName: 'Test', lastName: 'Trainer' });
    const otpTrainer = await OTP.create({ phoneNumber: '09120001111', otp: '1234' });
    const resTrainer = await request(app).post('/api/v1/auth/verify-otp').send({ phoneNumber: '09120001111', otp: otpTrainer.otp });
    trainerToken = resTrainer.body.tokens.access.token;

    // Create and login regular user
    regularUser = await User.create({ phoneNumber: '09120002222', role: userRole._id, firstName: 'Test', lastName: 'User' });
    const otpUser = await OTP.create({ phoneNumber: '09120002222', otp: '1234' });
    const resUser = await request(app).post('/api/v1/auth/verify-otp').send({ phoneNumber: '09120002222', otp: otpUser.otp });
    userToken = resUser.body.tokens.access.token;
  });

  describe('POST /api/v1/workouts/plans', () => {
    it('should allow a trainer to create a workout plan', async () => {
      await request(app)
        .post('/api/v1/workouts/plans')
        .set('Authorization', `Bearer ${trainerToken}`)
        .send(workoutPlanPayload)
        .expect(httpStatus.CREATED);
    });

    it('should forbid a regular user from creating a workout plan', async () => {
      await request(app)
        .post('/api/v1/workouts/plans')
        .set('Authorization', `Bearer ${userToken}`)
        .send(workoutPlanPayload)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('POST /api/v1/workouts/plans/assign', () => {
    it('should allow a trainer to assign a plan to a user', async () => {
      const plan = await WorkoutPlan.create({ ...workoutPlanPayload, trainer: trainer._id });

      await request(app)
        .post('/api/v1/workouts/plans/assign')
        .set('Authorization', `Bearer ${trainerToken}`)
        .send({ planId: plan._id, userId: regularUser._id })
        .expect(httpStatus.OK);

      const session = await UserWorkoutSession.findOne({ user: regularUser._id, plan: plan._id });
      expect(session).toBeDefined();
    });
  });

  describe('GET /api/v1/workouts/sessions/my-plan', () => {
    it('should allow a user to get their active plan', async () => {
      const plan = await WorkoutPlan.create({ ...workoutPlanPayload, trainer: trainer._id });
      await UserWorkoutSession.create({ user: regularUser._id, plan: plan._id });

      const res = await request(app)
        .get('/api/v1/workouts/sessions/my-plan')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(httpStatus.OK);

      expect((res.body.plan as any)._id).toBe((plan as any)._id.toString());
    });
  });

  describe('POST /api/v1/workouts/sessions/complete', () => {
    it("should allow a user to mark a day's workout as complete", async () => {
      const plan = await WorkoutPlan.create({ ...workoutPlanPayload, trainer: trainer._id });
      const day = await WorkoutDay.create({ plan: plan._id, dayOfWeek: 'Monday', name: 'Test Day' });
      await UserWorkoutSession.create({ user: regularUser._id, plan: plan._id });

      const res = await request(app)
        .post('/api/v1/workouts/sessions/complete')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ dayId: day._id, notes: 'Felt strong today.' })
        .expect(httpStatus.OK);

      expect(res.body.completedDays).toHaveLength(1);
      expect((res.body.completedDays[0] as any).dayId).toBe((day as any)._id.toString());
      expect(res.body.completedDays[0].notes).toBe('Felt strong today.');
    });
  });
});
