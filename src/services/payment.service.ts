import httpStatus from 'http-status';
import { ZarinPal } from 'zarinpal-node-sdk';
import { ApiError } from '../utils/ApiError';
import config from '../config';
import Order from '../models/order.model';
import Transaction from '../models/transaction.model';
import { IUser } from '../models/user.model';

const zarinpal = new ZarinPal(config.zarinpalMerchantId, {
  sandbox: config.env === 'development', // Use sandbox in development
});

class PaymentService {
  /**
   * Create a payment request for an order
   * @param {IUser} user
   * @param {string} orderId
   * @returns {Promise<string>} - The payment URL
   */
  public async createOrderPaymentRequest(user: IUser, orderId: string): Promise<string> {
    const order = await Order.findOne({ _id: orderId, user: user._id });
    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }
    if (order.status !== 'pending') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Order has already been processed');
    }

    const response = await zarinpal.payments.create({
      amount: order.totalAmount,
      callback_url: `http://localhost:${config.port}/api/v1/payments/callback`, // This should be a frontend URL in a real app
      description: `Payment for Order #${order._id}`,
      email: 'user@example.com', // Zarinpal requires an email or mobile
      mobile: user.phoneNumber,
    });

    if (response.result.code !== 100) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create payment request with Zarinpal');
    }

    await Transaction.create({
      user: user._id,
      order: order._id,
      amount: order.totalAmount,
      authority: response.result.authority,
      description: `Payment for Order #${order._id}`,
    });

    return zarinpal.payments.getRedirectUrl(response.result.authority);
  }

  /**
   * Verify a Zarinpal payment
   * @param {string} authority
   * @param {string} status
   * @returns {Promise<any>}
   */
  public async verifyPayment(authority: string, status: string): Promise<any> {
    if (status !== 'OK') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Payment was not successful or was cancelled by the user');
    }

    const transaction = await Transaction.findOne({ authority });
    if (!transaction) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
    }

    const response = await zarinpal.verifications.verify({
      authority,
      amount: transaction.amount,
    });

    if (response.result.code === 100 || response.result.code === 101) { // 101 means already verified
      transaction.status = 'completed';
      transaction.refId = response.result.ref_id.toString();
      await transaction.save();

      // Update the order status
      await Order.updateOne({ _id: transaction.order }, { status: 'paid' }); // Or 'processing'

      return { message: 'Payment verified successfully', transaction };
    }

    transaction.status = 'failed';
    await transaction.save();
    throw new ApiError(httpStatus.BAD_REQUEST, 'Payment verification failed');
  }
}

export default new PaymentService();
