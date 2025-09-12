import { Schema, model, Document } from 'mongoose';
import { IRole } from '../role/role.model';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: IRole['_id'];
  refreshTokens?: string[];

  // Profile fields
  height?: number; // in cm
  weight?: number; // in kg
  gender?: 'male' | 'female' | 'other';
  birthDate?: Date;
  profilePictureUrl?: string;
  goals?: string[];

  subscription?: {
    plan: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
  };
}

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phoneNumber: { type: String, required: true, unique: true, trim: true },
  role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
  refreshTokens: { type: [String], default: [], select: false },

  // Profile fields
  height: { type: Number },
  weight: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  birthDate: { type: Date },
  profilePictureUrl: { type: String, trim: true },
  goals: { type: [String], default: [] },

  subscription: {
    plan: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: false }
  }
}, { timestamps: true });


const User = model<IUser>('User', UserSchema);

export default User;
