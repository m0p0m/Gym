import { Router } from 'express';
import orderController from '../../controllers/order.controller';
import orderValidation from '../../validations/order.validation';
import auth from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validate';

const router = Router();

router.post('/', auth(), validate(orderValidation.createOrder), orderController.createOrder);

router.get('/', auth(), orderController.getMyOrders);

router.get('/:orderId', auth(), validate(orderValidation.getOrder), orderController.getOrder);

export default router;
