import httpStatus from 'http-status';
import { ApiError } from '../utils/ApiError';
import Order from '../models/order.model';
import Cart from '../models/cart.model';
import Product from '../models/product.model';
import { IUser } from '../models/user.model';

class OrderService {
  /**
   * Create an order from a user's cart
   * @param {IUser['_id']} userId
   * @param {object} shippingAddress
   * @returns {Promise<any>}
   */
  public async createOrderFromCart(userId: IUser['_id'], shippingAddress: any): Promise<any> {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Cart is empty');
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product as any;
      if (product.stockQuantity < item.quantity) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Not enough stock for ${product.name}`);
      }
      totalAmount += item.price * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: item.price,
        name: product.name,
      });
    }

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: 'pending',
    });

    // Decrease stock quantity for each product
    for (const item of order.items) {
      await Product.updateOne({ _id: item.product }, { $inc: { stockQuantity: -item.quantity } });
    }

    // Clear the user's cart
    cart.items = [];
    await cart.save();

    return order;
  }

  /**
   * Get all orders for a user
   * @param {IUser['_id']} userId
   * @returns {Promise<any>}
   */
  public async getOrdersForUser(userId: IUser['_id']): Promise<any> {
    return Order.find({ user: userId }).sort({ createdAt: -1 });
  }
}

export default new OrderService();
