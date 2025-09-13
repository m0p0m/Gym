import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import productService from '../services/product.service';
import { Types } from 'mongoose';

class ProductController {
  public createProduct = catchAsync(async (req: Request, res: Response) => {
    const product = await productService.createProduct(req.body);
    res.status(httpStatus.CREATED).send(product);
  });

  public getProducts = catchAsync(async (req: Request, res: Response) => {
    const result = await productService.queryProducts(req.query);
    res.status(httpStatus.OK).send(result);
  });

  public getProduct = catchAsync(async (req: Request, res: Response) => {
    const product = await productService.getProductById(new Types.ObjectId(req.params.productId));
    res.status(httpStatus.OK).send(product);
  });

  public updateProduct = catchAsync(async (req: Request, res: Response) => {
    const product = await productService.updateProductById(new Types.ObjectId(req.params.productId), req.body);
    res.status(httpStatus.OK).send(product);
  });

  public deleteProduct = catchAsync(async (req: Request, res: Response) => {
    await productService.deleteProductById(new Types.ObjectId(req.params.productId));
    res.status(httpStatus.NO_CONTENT).send();
  });
}

export default new ProductController();
