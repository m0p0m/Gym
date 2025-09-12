import { Router } from 'express';
import userController from './user.controller';
import userValidation from './user.validation';
import auth from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validate';

const router = Router();

router
  .route('/me')
  .get(auth(), userController.getProfile)
  .patch(auth(), validate({ body: userValidation.updateProfile.body }), userController.updateProfile);

export default router;
