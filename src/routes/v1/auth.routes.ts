import { Router } from 'express';
import authController from '../../controllers/auth.controller';
import authValidation from '../../validations/auth.validation';
import validate from '../../middlewares/validate';
import { authLimiter } from '../../middlewares/rateLimiter.middleware';

const router = Router();

router.post('/send-otp', authLimiter, validate({ body: authValidation.sendOtp.body }), authController.sendOtp);
router.post('/verify-otp', authLimiter, validate({ body: authValidation.verifyOtp.body }), authController.verifyOtp);
router.post('/refresh-token', validate({ body: authValidation.refreshToken.body }), authController.refreshToken);

export default router;
