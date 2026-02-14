import { Router } from 'express';
import { CommentController } from '@/controllers/CommentController';
import { authenticate } from '@/middleware/authenticate';

const router = Router({ mergeParams: true });
const commentController = new CommentController();

router.use(authenticate);

/**
 * POST /api/tickets/:ticketId/comments
 * Create comment
 */
router.post('/', (req, res, next) => commentController.createComment(req, res, next));

/**
 * GET /api/tickets/:ticketId/comments
 * List comments
 */
router.get('/', (req, res, next) => commentController.getComments(req, res, next));

/**
 * PATCH /api/comments/:commentId
 * Update comment
 */
router.patch('/:commentId', (req, res, next) => commentController.updateComment(req, res, next));

/**
 * DELETE /api/comments/:commentId
 * Delete comment
 */
router.delete('/:commentId', (req, res, next) => commentController.deleteComment(req, res, next));

export default router;
