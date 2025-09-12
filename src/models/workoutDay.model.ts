import { Schema, model, Document } from 'mongoose';
import { IWorkoutPlan } from './workoutPlan.model';

export interface IWorkoutDay extends Document {
  plan: IWorkoutPlan['_id'];
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  name: string; // e.g., "Chest & Triceps"
  description?: string;
  // We will populate exercises later
}

const WorkoutDaySchema = new Schema<IWorkoutDay>({
  plan: { type: Schema.Types.ObjectId, ref: 'WorkoutPlan', required: true },
  dayOfWeek: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
}, { timestamps: true });

const WorkoutDay = model<IWorkoutDay>('WorkoutDay', WorkoutDaySchema);

export default WorkoutDay;
