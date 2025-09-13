import { Schema, model, Document } from 'mongoose';
import { IUser } from './user.model';
import { IWorkoutPlan } from './workoutPlan.model';

// Represents a user's specific instance of a workout plan
export interface IUserWorkoutSession extends Document {
  user: IUser['_id'];
  plan: IWorkoutPlan['_id'];
  startDate: Date;
  isActive: boolean;
  completedDays: {
    dayId: Schema.Types.ObjectId;
    dateCompleted: Date;
    notes?: string;
  }[];
}

const UserWorkoutSessionSchema = new Schema<IUserWorkoutSession>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: Schema.Types.ObjectId, ref: 'WorkoutPlan', required: true },
  startDate: { type: Date, default: Date.now, required: true },
  isActive: { type: Boolean, default: true },
  completedDays: [
    new Schema({
      dayId: { type: Schema.Types.ObjectId, ref: 'WorkoutDay', required: true },
      dateCompleted: { type: Date, default: Date.now },
      notes: { type: String, trim: true },
    }, { _id: false })
  ],
}, { timestamps: true });

const UserWorkoutSession = model<IUserWorkoutSession>('UserWorkoutSession', UserWorkoutSessionSchema);

export default UserWorkoutSession;
