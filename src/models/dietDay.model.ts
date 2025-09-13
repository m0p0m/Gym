import { Schema, model, Document } from 'mongoose';
import { IDietPlan } from './dietPlan.model';

export interface IDietDay extends Document {
  plan: IDietPlan['_id'];
  dayNumber: number; // e.g., Day 1, Day 2
  notes?: string;
}

const DietDaySchema = new Schema<IDietDay>({
  plan: { type: Schema.Types.ObjectId, ref: 'DietPlan', required: true },
  dayNumber: { type: Number, required: true, min: 1 },
  notes: { type: String, trim: true },
}, { timestamps: true });

const DietDay = model<IDietDay>('DietDay', DietDaySchema);

export default DietDay;
