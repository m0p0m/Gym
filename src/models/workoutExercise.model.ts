import { Schema, model, Document } from 'mongoose';
import { IWorkoutDay } from './workoutDay.model';

export interface IWorkoutExercise extends Document {
  workoutDay: IWorkoutDay['_id'];
  exerciseName: string;
  description?: string;
  videoUrl?: string;
  sets: number;
  reps: string; // e.g., "8-12" or "15"
  restPeriodSeconds: number;
}

const WorkoutExerciseSchema = new Schema<IWorkoutExercise>({
  workoutDay: { type: Schema.Types.ObjectId, ref: 'WorkoutDay', required: true },
  exerciseName: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  videoUrl: { type: String, trim: true },
  sets: { type: Number, required: true },
  reps: { type: String, required: true },
  restPeriodSeconds: { type: Number, required: true },
}, { timestamps: true });

const WorkoutExercise = model<IWorkoutExercise>('WorkoutExercise', WorkoutExerciseSchema);

export default WorkoutExercise;
