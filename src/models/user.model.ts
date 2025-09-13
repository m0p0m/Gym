import { Schema, model, Document } from 'mongoose';
import { IRole } from './role.model';
import { ISubscription } from './subscription.model';

// Nested Schemas for better organization
const MedicalInfoSchema = new Schema({
  conditions: { type: [String], default: [] },
  allergies: { type: [String], default: [] },
  notes: { type: String, trim: true },
}, { _id: false });

const EmergencyContactSchema = new Schema({
  name: { type: String, trim: true },
  relationship: { type: String, trim: true },
  phoneNumber: { type: String, trim: true },
}, { _id: false });

const BodyMeasurementsSchema = new Schema({
  bodyFatPercentage: { type: Number },
  neck: { type: Number },
  chest: { type: Number },
  waist: { type: Number },
  hips: { type: Number },
}, { _id: false });


export interface IUser extends Document {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: IRole['_id'];
  subscriptions: ISubscription['_id'][];
  refreshTokens?: string[];

  // --- Profile fields ---
  height?: number; // in cm
  weight?: number; // in kg
  gender?: 'male' | 'female' | 'other';
  birthDate?: Date;
  profilePictureUrl?: string;
  goals?: string[];

  // Nested profile info
  medicalInfo?: {
    conditions?: string[];
    allergies?: string[];
    notes?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phoneNumber?: string;
  };
  bodyMeasurements?: {
    bodyFatPercentage?: number;
    neck?: number;
    chest?: number;
    waist?: number;
    hips?: number;
  };
}

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phoneNumber: { type: String, required: true, unique: true, trim: true },
  role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
  subscriptions: [{ type: Schema.Types.ObjectId, ref: 'Subscription' }],
  refreshTokens: { type: [String], default: [], select: false },

  // Profile fields
  height: { type: Number },
  weight: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  birthDate: { type: Date },
  profilePictureUrl: { type: String, trim: true },
  goals: { type: [String], default: [] },

  // Nested profile info
  medicalInfo: { type: MedicalInfoSchema, default: {} },
  emergencyContact: { type: EmergencyContactSchema, default: {} },
  bodyMeasurements: { type: BodyMeasurementsSchema, default: {} },

}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual for active subscription
UserSchema.virtual('activeSubscription', {
  ref: 'Subscription',
  localField: 'subscriptions',
  foreignField: '_id',
  justOne: true,
  match: { status: 'active' }
});


const User = model<IUser>('User', UserSchema);

export default User;
