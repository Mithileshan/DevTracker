import { Router, Request, Response, NextFunction } from 'express';
import { CommentController } from '@/controllers/CommentController';
import { authenticate } from '@/middleware/authenticate';

const router = Router({ mergeParams: true });
const commentController = new CommentController();

router.use(authenticate);

/**
 * POST /api/tickets/:ticketId/comments
 * Create comment
 */
router.post('/', (req: Request, res: Response, next: NextFunction) => commentController.createComment(req, res, next));

/**
 * GET /api/tickets/:ticketId/comments
 * List comments
 */
router.get('/', (req: Request, res: Response, next: NextFunction) => commentController.getComments(req, res, next));

/**
 * PATCH /api/comments/:commentId
 * Update comment
 */
router.patch('/:commentId', (req: Request, res: Response, next: NextFunction) => commentController.updateComment(req, res, next));

/**
 * DELETE /api/comments/:commentId
 * Delete comment
 */
router.delete('/:commentId', (req: Request, res: Response, next: NextFunction) => commentController.deleteComment(req, res, next));

export default router;
