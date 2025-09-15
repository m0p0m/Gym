import { Router } from 'express';
import productController from '../../controllers/product.controller';
import productValidation from '../../validations/product.validation';
import auth from '../../middlewares/auth.middleware';
import hasPermission from '../../middlewares/permission.middleware';
import validate from '../../middlewares/validate';

const router = Router();

router
  .route('/')
  .post(
    auth(),
    hasPermission('products:create'),
    validate(productValidation.createProduct),
    productController.createProduct
  )
  .get(validate(productValidation.getProducts), productController.getProducts);

router
  .route('/:productId')
  .get(validate(productValidation.getProduct), productController.getProduct)
  .patch(
    auth(),
    hasPermission('products:update'),
    validate(productValidation.updateProduct),
    productController.updateProduct
  )
  .delete(
    auth(),
    hasPermission('products:delete'),
    validate(productValidation.deleteProduct),
    productController.deleteProduct
  );

export default router;
