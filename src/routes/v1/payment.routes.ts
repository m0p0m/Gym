import { Router } from 'express';
import paymentController from '../../controllers/payment.controller';
import paymentValidation from '../../validations/payment.validation';
import auth from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validate';
import verifyPaymentCallback from '../../middlewares/verifyPaymentCallback.middleware';

const router = Router();

router.post(
  '/request/order/:orderId',
  auth(),
  validate(paymentValidation.createOrderPayment),
  paymentController.createOrderPayment
);

router.get(
  '/callback',
  verifyPaymentCallback, // Secure the callback
  validate(paymentValidation.paymentCallback),
  paymentController.paymentCallback
);

export default router;
