import { Router } from 'express';
import userController from '../../../controllers/user.controller';
import userValidation from '../../../validations/user.validation';
import auth from '../../../middlewares/auth.middleware';
import validate from '../../../middlewares/validate';

const router = Router();

router
  .route('/me')
  .get(auth(), userController.getProfile)
  .patch(auth(), validate({ body: userValidation.updateProfile.body }), userController.updateProfile);

export default router;
