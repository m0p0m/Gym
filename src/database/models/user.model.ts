import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IRole } from './role.model';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password?: string; // Optional because it will be removed from query results
  role: IRole['_id'];
  subscription?: {
    plan: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
  };
  comparePassword(password: string): Promise<boolean>;
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
  password: {
    type: String,
    required: true,
    select: false, // Automatically exclude password from query results
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
  subscription: {
    plan: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: false }
  }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare entered password with hashed password
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};


const User = model<IUser>('User', UserSchema);

export default User;
