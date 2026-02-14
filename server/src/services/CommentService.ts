import { TicketComment } from '@/models/TicketComment';
import { Ticket } from '@/models/Ticket';
import { ProjectMembership } from '@/models/ProjectMembership';
import { NotificationService } from '@/services/NotificationService';
import { NotFoundError, ForbiddenError } from '@/utils/errors';
import { hasPermission, ProjectRole } from '@/utils/rbac';

const notificationService = new NotificationService();

export class CommentService {
  async createComment(
    ticketId: string,
    userId: string,
    body: string,
    mentions: string[] = []
  ): Promise<any> {
    // Get ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket || ticket.deletedAt) {
      throw new NotFoundError('Ticket');
    }

    // Verify user is project member
    const membership = await ProjectMembership.findOne({
      projectId: ticket.projectId,
      userId,
    });
    if (!membership) {
      throw new ForbiddenError('You do not have access to this ticket');
    }

    // Create comment
    const comment = await TicketComment.create({
      ticketId,
      authorId: userId,
      body,
      mentions,
    });

    // Create notifications for mentioned users
    if (mentions.length > 0) {
      for (const mentionedUserId of mentions) {
        await notificationService.createNotification(
          mentionedUserId,
          ticket.orgId.toString(),
          'comment_mentioned',
          {
            ticketId: ticket._id,
            commentId: comment._id,
            mentionedIn: body,
          }
        );
      }
    }

    return await comment.populate('authorId', 'name email');
  }

  async getComments(ticketId: string, userId: string, page: number = 1, limit: number = 20): Promise<any> {
    // Get ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket || ticket.deletedAt) {
      throw new NotFoundError('Ticket');
    }

    // Verify user is project member
    const membership = await ProjectMembership.findOne({
      projectId: ticket.projectId,
      userId,
    });
    if (!membership) {
      throw new ForbiddenError('You do not have access to this ticket');
    }

    const skip = (page - 1) * limit;
    const total = await TicketComment.countDocuments({ ticketId });
    const comments = await TicketComment.find({ ticketId })
      .populate('authorId', 'name email')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      data: comments,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async updateComment(commentId: string, userId: string, body: string): Promise<any> {
    const comment = await TicketComment.findById(commentId);
    if (!comment) {
      throw new NotFoundError('Comment');
    }

    // Verify user is author
    if (comment.authorId.toString() !== userId) {
      throw new ForbiddenError('You can only edit your own comments');
    }

    comment.body = body;
    await comment.save();

    return await comment.populate('authorId', 'name email');
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await TicketComment.findById(commentId);
    if (!comment) {
      throw new NotFoundError('Comment');
    }

    // Verify user is author or project admin
    const ticket = await Ticket.findById(comment.ticketId);
    if (!ticket) {
      throw new NotFoundError('Ticket');
    }

    const membership = await ProjectMembership.findOne({
      projectId: ticket.projectId,
      userId,
    });
    if (!membership) {
      throw new ForbiddenError('You do not have access to this ticket');
    }

    // Only author or admins can delete
    if (comment.authorId.toString() !== userId && !['admin', 'owner'].includes(membership.role)) {
      throw new ForbiddenError('You do not have permission to delete this comment');
    }

    await TicketComment.findByIdAndDelete(commentId);
  }
}
