import { Schema, model, Document } from 'mongoose';
import { IUser } from './user.model';

export interface IWorkoutPlan extends Document {
  name: string;
  description?: string;
  trainer: IUser['_id']; // The user who created the plan (must have trainer role)
  durationWeeks: number; // e.g., 4 weeks
  // We will populate workoutDays later
}

const WorkoutPlanSchema = new Schema<IWorkoutPlan>({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  trainer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  durationWeeks: { type: Number, required: true },
}, { timestamps: true });

const WorkoutPlan = model<IWorkoutPlan>('WorkoutPlan', WorkoutPlanSchema);

export default WorkoutPlan;
