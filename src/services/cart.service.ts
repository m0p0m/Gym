import httpStatus from 'http-status';
import { ApiError } from '../utils/ApiError';
import Cart, { ICart } from '../models/cart.model';
import Product from '../models/product.model';
import { IUser } from '../models/user.model';
import { Types } from 'mongoose';

class CartService {
  /**
   * Get or create a cart for a user
   * @param {IUser['_id']} userId
   * @returns {Promise<ICart>}
   */
  private async getOrCreateCart(userId: IUser['_id']): Promise<ICart> {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }
    return cart;
  }

  /**
   * Add an item to the user's cart
   * @param {IUser['_id']} userId
   * @param {Types.ObjectId} productId
   * @param {number} quantity
   * @returns {Promise<ICart>}
   */
  public async addItemToCart(userId: IUser['_id'], productId: Types.ObjectId, quantity: number): Promise<ICart> {
    const product = await Product.findById(productId);
    if (!product || !product.isAvailable) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found or not available');
    }
    if (product.stockQuantity < quantity) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Not enough stock available');
    }

    const cart = await this.getOrCreateCart(userId);
    const existingItemIndex = cart.items.findIndex(item => (item.product as any).equals(productId));

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ product: productId, quantity, price: product.price });
    }

    await cart.save();
    return cart.populate('items.product');
  }

  /**
   * Get user's cart
   * @param {IUser['_id']} userId
   * @returns {Promise<ICart>}
   */
  public async getCartByUserId(userId: IUser['_id']): Promise<ICart> {
      const cart = await this.getOrCreateCart(userId);
      return cart.populate('items.product');
  }
}

export default new CartService();
