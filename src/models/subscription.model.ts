import { Schema, model, Document } from 'mongoose';
import { IUser } from './user.model';
import { ISubscriptionPlan } from './subscriptionPlan.model';

export interface ISubscription extends Document {
  user: IUser['_id'];
  plan: ISubscriptionPlan['_id'];
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'cancelled';
  paymentDetails?: {
    transactionId: string;
    amount: number;
    date: Date;
  };
}

const SubscriptionSchema = new Schema<ISubscription>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    required: true,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active',
  },
  paymentDetails: {
    transactionId: String,
    amount: Number,
    date: Date,
  },
}, { timestamps: true });

const Subscription = model<ISubscription>('Subscription', SubscriptionSchema);

export default Subscription;
