import { Schema, model, Document } from 'mongoose';

export interface IOtp extends Document {
  phoneNumber: string;
  otp: string;
  createdAt: Date;
}

const OTPSchema = new Schema<IOtp>({
  phoneNumber: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // This creates a TTL index, so documents will be automatically deleted from the collection 5 minutes after their creation time.
    expires: 300, // 5 minutes in seconds
  },
});

const OTP = model<IOtp>('OTP', OTPSchema);

export default OTP;
