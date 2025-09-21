import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import cartService from '../services/cart.service';
import { Types } from 'mongoose';

class CartController {
  public getCart = catchAsync(async (req: Request, res: Response) => {
    const cart = await cartService.getCartByUserId(req.user!._id);
    res.status(httpStatus.OK).send(cart);
  });

  public addItem = catchAsync(async (req: Request, res: Response) => {
    const { productId, quantity } = req.body;
    const cart = await cartService.addItemToCart(req.user!._id, new Types.ObjectId(productId), quantity);
    res.status(httpStatus.OK).send(cart);
  });

  public updateItem = catchAsync(async (req: Request, res: Response) => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const cart = await cartService.updateCartItem(req.user!._id, new Types.ObjectId(itemId), quantity);
    res.status(httpStatus.OK).send(cart);
  });

  public removeItem = catchAsync(async (req: Request, res: Response) => {
    const { itemId } = req.params;
    const cart = await cartService.removeCartItem(req.user!._id, new Types.ObjectId(itemId));
    res.status(httpStatus.OK).send(cart);
  });
}

export default new CartController();
