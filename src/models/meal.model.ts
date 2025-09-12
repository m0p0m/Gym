import { Schema, model, Document } from 'mongoose';
import { IDietDay } from './dietDay.model';

export interface IMeal extends Document {
  dietDay: IDietDay['_id'];
  name: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  time: string; // e.g., "08:00"
}

const MealSchema = new Schema<IMeal>({
  dietDay: { type: Schema.Types.ObjectId, ref: 'DietDay', required: true },
  name: {
    type: String,
    required: true,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack']
  },
  time: { type: String, required: true },
}, { timestamps: true });

const Meal = model<IMeal>('Meal', MealSchema);

export default Meal;
