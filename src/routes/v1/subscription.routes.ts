import { Router } from 'express';
import subscriptionController from '../../controllers/subscription.controller';
import subscriptionValidation from '../../validations/subscription.validation';
import auth from '../../middlewares/auth.middleware';
import hasPermission from '../../middlewares/permission.middleware';
import validate from '../../middlewares/validate';

const router = Router();

router.post(
  '/plans',
  auth(),
  hasPermission('subscriptions:create'),
  validate({ body: subscriptionValidation.createPlan.body }),
  subscriptionController.createPlan
);

router.post(
  '/',
  auth(),
  hasPermission('subscriptions:assign'),
  validate({ body: subscriptionValidation.assignSubscription.body }),
  subscriptionController.assignSubscription
);

router.get(
  '/me',
  auth(),
  subscriptionController.getMySubscription
);

export default router;
