import httpStatus from 'http-status';
import { ApiError } from '../utils/ApiError';
import Notification, { INotification, NotificationType } from '../models/notification.model';
import { IUser } from '../models/user.model';
import { Types } from 'mongoose';

class NotificationService {
  /**
   * Create a notification
   * @param {IUser['_id']} userId
   * @param {string} title
   * @param {string} message
   * @param {NotificationType} type
   * @param {string} [link]
   * @returns {Promise<INotification>}
   */
  public async createNotification(
    userId: IUser['_id'],
    title: string,
    message: string,
    type: NotificationType,
    link?: string
  ): Promise<INotification> {
    return Notification.create({ user: userId, title, message, type, link });
  }

  /**
   * Get user notifications
   * @param {IUser['_id']} userId
   * @returns {Promise<INotification[]>}
   */
  public async getUserNotifications(userId: IUser['_id']): Promise<INotification[]> {
    return Notification.find({ user: userId }).sort({ createdAt: -1 });
  }

  /**
   * Mark a notification as read
   * @param {Types.ObjectId} notificationId
   * @param {IUser['_id']} userId
   * @returns {Promise<INotification>}
   */
  public async markAsRead(notificationId: Types.ObjectId, userId: IUser['_id']): Promise<INotification> {
    const notification = await Notification.findOne({ _id: notificationId, user: userId });
    if (!notification) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
    }
    notification.isRead = true;
    await notification.save();
    return notification;
  }
}

export default new NotificationService();
