import { Schema, model, Document } from 'mongoose';
import { IUser } from './user.model';
import { IProduct } from './product.model';

interface ICartItem {
  product: IProduct['_id'];
  quantity: number;
  price: number; // Price at the time of adding to cart
}

export interface ICart extends Document {
  user: IUser['_id'];
  items: ICartItem[];
}

const CartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
}, { _id: false });

const CartSchema = new Schema<ICart>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: { type: [CartItemSchema], default: [] },
}, { timestamps: true });

const Cart = model<ICart>('Cart', CartSchema);

export default Cart;
