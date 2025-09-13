import { Router } from 'express';
import productController from '../../controllers/product.controller';
import productValidation from '../../validations/product.validation';
import auth from '../../middlewares/auth.middleware';
import hasPermission from '../../middlewares/permission.middleware';
import validate from '../../middlewares/validate';

const router = Router();

// Public routes
router.get('/', validate(productValidation.getProducts), productController.getProducts);
router.get('/:productId', validate(productValidation.getProduct), productController.getProduct);

// Admin routes
router.post(
  '/',
  auth(),
  hasPermission('products:create'),
  validate(productValidation.createProduct),
  productController.createProduct
);

router.patch(
  '/:productId',
  auth(),
  hasPermission('products:update'),
  validate(productValidation.updateProduct),
  productController.updateProduct
);

router.delete(
  '/:productId',
  auth(),
  hasPermission('products:delete'),
  validate(productValidation.deleteProduct),
  productController.deleteProduct
);

export default router;
