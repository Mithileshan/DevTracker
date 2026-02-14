import { Router } from 'express';
import { NotificationController } from '@/controllers/NotificationController';
import { authenticate } from '@/middleware/authenticate';

const router = Router();
const notificationController = new NotificationController();

router.use(authenticate);

/**
 * GET /api/notifications
 * List user notifications
 */
router.get('/', (req, res, next) => notificationController.getNotifications(req, res, next));

/**
 * PATCH /api/notifications/:notificationId/read
 * Mark notification as read
 */
router.patch('/:notificationId/read', (req, res, next) =>
  notificationController.markAsRead(req, res, next)
);

/**
 * POST /api/notifications/read-all
 * Mark all notifications as read
 */
router.post('/read-all', (req, res, next) =>
  notificationController.markAllAsRead(req, res, next)
);

/**
 * DELETE /api/notifications/:notificationId
 * Delete notification
 */
router.delete('/:notificationId', (req, res, next) =>
  notificationController.deleteNotification(req, res, next)
);

export default router;
