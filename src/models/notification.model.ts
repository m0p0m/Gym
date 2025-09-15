import { Schema, model, Document } from 'mongoose';
import { IUser } from './user.model';

export type NotificationType = 'order_success' | 'workout_completed' | 'subscription_reminder';

export interface INotification extends Document {
  user: IUser['_id'];
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string; // e.g., /orders/some-id
}

const NotificationSchema = new Schema<INotification>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['order_success', 'workout_completed', 'subscription_reminder']
  },
  isRead: { type: Boolean, default: false, index: true },
  link: { type: String },
}, { timestamps: true });

const Notification = model<INotification>('Notification', NotificationSchema);

export default Notification;
