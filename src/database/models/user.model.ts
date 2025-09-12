import { Schema, model, Document } from 'mongoose';
import { IRole } from './role.model';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: IRole['_id'];
  refreshTokens?: string[];
  subscription?: {
    plan: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
  };
}

const UserSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
  refreshTokens: {
    type: [String],
    default: [],
    select: false, // Exclude from query results by default
  },
  subscription: {
    plan: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: false }
  }
}, { timestamps: true });


const User = model<IUser>('User', UserSchema);

export default User;
