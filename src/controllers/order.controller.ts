import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import orderService from '../services/order.service';

class OrderController {
  public createOrder = catchAsync(async (req: Request, res: Response) => {
    const order = await orderService.createOrderFromCart(req.user!._id, req.body.shippingAddress);
    res.status(httpStatus.CREATED).send(order);
  });

  public getMyOrders = catchAsync(async (req: Request, res: Response) => {
    const orders = await orderService.getOrdersForUser(req.user!._id);
    res.status(httpStatus.OK).send(orders);
  });

  public getOrder = catchAsync(async (req: Request, res: Response) => {
    const order = await orderService.getOrderById(req.params.orderId, req.user!._id);
    res.status(httpStatus.OK).send(order);
  });
}

export default new OrderController();
