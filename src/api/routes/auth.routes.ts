import { Router } from 'express';
import authController from '../controllers/auth.controller';
import authValidation from '../validations/auth.validation';
import validate from '../../middlewares/validate';

const router = Router();

router.post('/register', validate({ body: authValidation.register.body }), authController.register);
router.post('/login', validate({ body: authValidation.login.body }), authController.login);

export default router;
