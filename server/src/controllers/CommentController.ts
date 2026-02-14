import { Request, Response, NextFunction } from 'express';
import { CommentService } from '@/services/CommentService';
import { CreateCommentSchema, UpdateCommentSchema } from 'shared/schemas';
import { ValidationError } from '@/utils/errors';
import { ApiSuccess } from 'shared/types';

const commentService = new CommentService();

export class CommentController {
  async createComment(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      const parsed = CreateCommentSchema.safeParse(req.body);
      if (!parsed.success) {
        const details = parsed.error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        throw new ValidationError('Validation failed', details);
      }

      const comment = await commentService.createComment(
        req.params.ticketId,
        req.user.userId,
        parsed.data.body,
        parsed.data.mentions
      );

      const response: ApiSuccess<any> = {
        success: true,
        data: comment,
        message: 'Comment created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getComments(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const comments = await commentService.getComments(
        req.params.ticketId,
        req.user.userId,
        page,
        limit
      );

      const response: ApiSuccess<any> = {
        success: true,
        data: comments,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateComment(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      const parsed = UpdateCommentSchema.safeParse(req.body);
      if (!parsed.success) {
        const details = parsed.error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        throw new ValidationError('Validation failed', details);
      }

      const comment = await commentService.updateComment(
        req.params.commentId,
        req.user.userId,
        parsed.data.body
      );

      const response: ApiSuccess<any> = {
        success: true,
        data: comment,
        message: 'Comment updated successfully',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      await commentService.deleteComment(req.params.commentId, req.user.userId);

      const response: ApiSuccess<null> = {
        success: true,
        data: null,
        message: 'Comment deleted successfully',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
