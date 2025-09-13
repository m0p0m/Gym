import { Schema, model, Document } from 'mongoose';
import { IUser } from './user.model';
import { IOrder } from './order.model';

export interface ITransaction extends Document {
  user: IUser['_id'];
  order?: IOrder['_id']; // Link to an order if it's a product purchase
  amount: number;
  authority: string; // From Zarinpal
  status: 'pending' | 'completed' | 'failed';
  refId?: string; // The reference ID from Zarinpal on success
  description: string;
}

const TransactionSchema = new Schema<ITransaction>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: Schema.Types.ObjectId, ref: 'Order' },
  amount: { type: Number, required: true },
  authority: { type: String, required: true, index: true },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  refId: { type: String },
  description: { type: String, required: true },
}, { timestamps: true });

const Transaction = model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
