import { Schema, model, Document } from 'mongoose';
import { IUser } from './user.model';
import { IDietPlan } from './dietPlan.model';

// Represents a user's specific instance of a diet plan
export interface IUserDietSession extends Document {
  user: IUser['_id'];
  plan: IDietPlan['_id'];
  startDate: Date;
  isActive: boolean;
  adherence: {
    date: string; // "YYYY-MM-DD"
    followed: boolean;
  }[];
}

const UserDietSessionSchema = new Schema<IUserDietSession>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: Schema.Types.ObjectId, ref: 'DietPlan', required: true },
  startDate: { type: Date, default: Date.now, required: true },
  isActive: { type: Boolean, default: true },
  adherence: [
    new Schema({
      date: { type: String, required: true },
      followed: { type: Boolean, required: true },
    }, { _id: false })
  ],
}, { timestamps: true });

const UserDietSession = model<IUserDietSession>('UserDietSession', UserDietSessionSchema);

export default UserDietSession;
