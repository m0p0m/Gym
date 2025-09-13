import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import paymentService from '../services/payment.service';

class PaymentController {
  public createOrderPayment = catchAsync(async (req: Request, res: Response) => {
    const paymentUrl = await paymentService.createOrderPaymentRequest(req.user!, req.params.orderId);
    res.status(httpStatus.OK).send({ paymentUrl });
  });

  public paymentCallback = catchAsync(async (req: Request, res: Response) => {
    const { Authority, Status } = req.query;
    if (!Authority || !Status) {
      return res.status(httpStatus.BAD_REQUEST).send('Invalid callback query parameters');
    }

    const result = await paymentService.verifyPayment(Authority.toString(), Status.toString());

    // In a real application, you would redirect the user to a success/failure page on your frontend.
    res.status(httpStatus.OK).send(result);
  });
}

export default new PaymentController();
