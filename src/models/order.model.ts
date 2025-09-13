import { Schema, model, Document } from 'mongoose';
import { IUser } from './user.model';
import { IProduct } from './product.model';

interface IOrderItem {
  product: IProduct['_id'];
  quantity: number;
  price: number; // Price at the time of purchase
  name: string; // Product name at time of purchase
}

export interface IOrder extends Document {
  user: IUser['_id'];
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  name: { type: String, required: true },
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [OrderItemSchema], required: true },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
    index: true,
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
}, { timestamps: true });

const Order = model<IOrder>('Order', OrderSchema);

export default Order;
