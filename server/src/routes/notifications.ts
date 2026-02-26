import { Router, Request, Response, NextFunction } from 'express';
import { NotificationController } from '@/controllers/NotificationController';
import { authenticate } from '@/middleware/authenticate';

const router = Router();
const notificationController = new NotificationController();

router.use(authenticate);

/**
 * GET /api/notifications
 * List user notifications
 */
router.get('/', (req: Request, res: Response, next: NextFunction) => notificationController.getNotifications(req, res, next));

/**
 * PATCH /api/notifications/:notificationId/read
 * Mark notification as read
 */
router.patch('/:notificationId/read', (req: Request, res: Response, next: NextFunction) =>
  notificationController.markAsRead(req, res, next)
);

/**
 * POST /api/notifications/read-all
 * Mark all notifications as read
 */
router.post('/read-all', (req: Request, res: Response, next: NextFunction) =>
  notificationController.markAllAsRead(req, res, next)
);

/**
 * DELETE /api/notifications/:notificationId
 * Delete notification
 */
router.delete('/:notificationId', (req: Request, res: Response, next: NextFunction) =>
  notificationController.deleteNotification(req, res, next)
);

export default router;
