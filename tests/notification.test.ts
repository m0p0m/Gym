import request from 'supertest';
import httpStatus from 'http-status';
import app from '../src/index';
import User from '../src/models/user.model';
import Role from '../src/models/role.model';
import OTP from '../src/models/otp.model';
import Notification from '../src/models/notification.model';

describe('Notification Routes', () => {
  let userToken: string;
  let user: any;
  let notification: any;

  beforeEach(async () => {
    await User.deleteMany({});
    await Role.deleteMany({});
    await OTP.deleteMany({});
    await Notification.deleteMany({});

    const userRole = await Role.create({ name: 'User', description: 'desc', permissions: [] });
    user = await User.create({ phoneNumber: '0912NOTIF11', role: userRole._id, firstName: 'Notif', lastName: 'User' });
    const otp = await OTP.create({ phoneNumber: '0912NOTIF11', otp: '1234' });
    const res = await request(app).post('/api/v1/auth/verify-otp').send({ phoneNumber: '0912NOTIF11', otp: otp.otp });
    userToken = res.body.tokens.access.token;

    notification = await Notification.create({
      user: user._id,
      title: 'Test Notification',
      message: 'This is a test.',
      type: 'order_success',
    });
  });

  describe('GET /api/v1/notifications', () => {
    it('should get the user\'s notifications', async () => {
      const res = await request(app)
        .get('/api/v1/notifications')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(httpStatus.OK);

      expect(res.body).toHaveLength(1);
      expect(res.body[0].title).toBe('Test Notification');
    });
  });

  describe('PATCH /api/v1/notifications/:notificationId/read', () => {
    it('should mark a notification as read', async () => {
      const res = await request(app)
        .patch(`/api/v1/notifications/${notification._id}/read`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(httpStatus.OK);

      expect(res.body.isRead).toBe(true);
      const dbNotification = await Notification.findById(notification._id);
      expect(dbNotification?.isRead).toBe(true);
    });
  });
});
