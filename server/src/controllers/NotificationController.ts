import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '@/services/NotificationService';
import { ValidationError } from '@/utils/errors';
import { ApiSuccess } from 'shared/types';

const notificationService = new NotificationService();

export class NotificationController {
  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const unreadOnly = req.query.unread === 'true';

      const notifications = await notificationService.getUserNotifications(
        req.user.userId,
        page,
        limit,
        unreadOnly
      );

      const response: ApiSuccess<any> = {
        success: true,
        data: notifications,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      const notification = await notificationService.markNotificationAsRead(
        req.params.notificationId,
        req.user.userId
      );

      const response: ApiSuccess<any> = {
        success: true,
        data: notification,
        message: 'Notification marked as read',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      await notificationService.markAllNotificationsAsRead(req.user.userId);

      const response: ApiSuccess<null> = {
        success: true,
        data: null,
        message: 'All notifications marked as read',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteNotification(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      await notificationService.deleteNotification(
        req.params.notificationId,
        req.user.userId
      );

      const response: ApiSuccess<null> = {
        success: true,
        data: null,
        message: 'Notification deleted',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
