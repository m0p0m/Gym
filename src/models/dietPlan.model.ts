import { Schema, model, Document } from 'mongoose';
import { IUser } from './user.model';

export interface IDietPlan extends Document {
  name: string;
  description?: string;
  creator: IUser['_id']; // The user who created the plan (nutritionist/trainer)
  totalCalories: number;
}

const DietPlanSchema = new Schema<IDietPlan>({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  totalCalories: { type: Number, required: true },
}, { timestamps: true });

const DietPlan = model<IDietPlan>('DietPlan', DietPlanSchema);

export default DietPlan;
