import { Router } from 'express';
import notificationController from '../../controllers/notification.controller';
import notificationValidation from '../../validations/notification.validation';
import auth from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validate';

const router = Router();

router.get('/', auth(), notificationController.getMyNotifications);

router.patch(
  '/:notificationId/read',
  auth(),
  validate(notificationValidation.markAsRead),
  notificationController.markAsRead
);

export default router;
