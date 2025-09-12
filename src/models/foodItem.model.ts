import { Schema, model, Document } from 'mongoose';
import { IMeal } from './meal.model';

export interface IFoodItem extends Document {
  meal: IMeal['_id'];
  name: string;
  quantity: string; // e.g., "150g" or "1 cup"
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const FoodItemSchema = new Schema<IFoodItem>({
  meal: { type: Schema.Types.ObjectId, ref: 'Meal', required: true },
  name: { type: String, required: true, trim: true },
  quantity: { type: String, required: true, trim: true },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
}, { timestamps: true });

const FoodItem = model<IFoodItem>('FoodItem', FoodItemSchema);

export default FoodItem;
