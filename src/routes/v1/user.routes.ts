import { Router } from 'express';
import userController from '../../controllers/user.controller';
import userValidation from '../../validations/user.validation';
import auth from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validate';

const router = Router();

router.get(
  '/me',
  auth(),
  userController.getProfile
);

router.patch(
  '/me',
  auth(),
  validate({ body: userValidation.updateProfile.body }),
  userController.updateProfile
);

export default router;
