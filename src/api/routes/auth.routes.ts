import { Router } from 'express';
import authController from '../controllers/auth.controller';
import authValidation from '../validations/auth.validation';
import validate from '../../middlewares/validate';

const router = Router();

router.post('/send-otp', validate({ body: authValidation.sendOtp.body }), authController.sendOtp);
router.post('/verify-otp', validate({ body: authValidation.verifyOtp.body }), authController.verifyOtp);
router.post('/refresh-token', validate({ body: authValidation.refreshToken.body }), authController.refreshToken);

export default router;
