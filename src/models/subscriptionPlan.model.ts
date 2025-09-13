import { Schema, model, Document } from 'mongoose';

export interface ISubscriptionPlan extends Document {
  name: string; // e.g., "Gold Tier"
  description?: string;
  price: number;
  durationDays: number; // e.g., 30, 90, 365
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>({
  name: { type: String, required: true, trim: true, unique: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  durationDays: { type: Number, required: true, min: 1 },
}, { timestamps: true });

const SubscriptionPlan = model<ISubscriptionPlan>('SubscriptionPlan', SubscriptionPlanSchema);

export default SubscriptionPlan;
