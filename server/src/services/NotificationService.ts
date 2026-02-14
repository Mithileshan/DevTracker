import { Notification } from '@/models/Notification';
import { NotFoundError } from '@/utils/errors';

export class NotificationService {
  async createNotification(
    userId: string,
    orgId: string,
    type: string,
    payload: Record<string, any>
  ): Promise<any> {
    const notification = await Notification.create({
      userId,
      orgId,
      type,
      payload,
    });
    return notification;
  }

  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false
  ): Promise<any> {
    const query: any = { userId };
    if (unreadOnly) {
      query.readAt = null;
    }

    const skip = (page - 1) * limit;
    const total = await Notification.countDocuments(query);
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      data: notifications,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async markNotificationAsRead(notificationId: string, userId: string): Promise<any> {
    const notification = await Notification.findById(notificationId);
    if (!notification || notification.userId.toString() !== userId) {
      throw new NotFoundError('Notification');
    }

    notification.readAt = new Date();
    await notification.save();
    return notification;
  }

  async markAllNotificationsAsRead(userId: string) {
    await Notification.updateMany(
      { userId, readAt: null },
      { readAt: new Date() }
    );
  }

  async deleteNotification(notificationId: string, userId: string) {
    const notification = await Notification.findById(notificationId);
    if (!notification || notification.userId.toString() !== userId) {
      throw new NotFoundError('Notification');
    }

    await Notification.findByIdAndDelete(notificationId);
  }
}
