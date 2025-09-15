import { Router } from 'express';
import analyticsController from '../../controllers/analytics.controller';
import auth from '../../middlewares/auth.middleware';
import hasPermission from '../../middlewares/permission.middleware';

const router = Router();

router.get(
  '/stats',
  auth(),
  hasPermission('dashboard:read'),
  analyticsController.getStats
);

export default router;
