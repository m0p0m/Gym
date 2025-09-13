import { Schema, model, Document } from 'mongoose';
import { IUser } from './user.model';

export interface IAttendance extends Document {
  user: IUser['_id'];
  checkInTime: Date;
  checkOutTime?: Date;
  notes?: string;
}

const AttendanceSchema = new Schema<IAttendance>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  checkInTime: { type: Date, required: true },
  checkOutTime: { type: Date },
  notes: { type: String, trim: true },
}, { timestamps: true });

const Attendance = model<IAttendance>('Attendance', AttendanceSchema);

export default Attendance;
