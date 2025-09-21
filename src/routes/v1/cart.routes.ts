import { Router } from 'express';
import cartController from '../../controllers/cart.controller';
import cartValidation from '../../validations/cart.validation';
import auth from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validate';

const router = Router();

router.get('/', auth(), cartController.getCart);

router.post('/items', auth(), validate(cartValidation.addItem), cartController.addItem);

router.patch(
  '/items/:itemId',
  auth(),
  validate(cartValidation.updateItem),
  cartController.updateItem
);

router.delete(
  '/items/:itemId',
  auth(),
  validate(cartValidation.removeItem),
  cartController.removeItem
);

export default router;
