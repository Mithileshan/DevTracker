import { Ticket } from '@/models/Ticket';
import { ProjectMembership } from '@/models/ProjectMembership';
import { Project } from '@/models/Project';
import { AuditLog } from '@/models/AuditLog';
import { NotFoundError, ForbiddenError, ValidationError } from '@/utils/errors';
import { hasPermission, ProjectRole } from '@/utils/rbac';
import { PaginatedResponse, ITicket } from 'shared/types';
import { TicketFilters } from 'shared/schemas';

export class TicketService {
  async createTicket(
    orgId: string,
    projectId: string,
    userId: string,
    title: string,
    description: string,
    type: string,
    priority: string,
    tags?: string[],
    assigneeId?: string
  ): Promise<any> {
    // Verify user is project member
    const membership = await ProjectMembership.findOne({
      projectId,
      userId,
    });
    if (!membership) {
      throw new ForbiddenError('You do not have access to this project');
    }

    if (!hasPermission(membership.role as ProjectRole, 'create_ticket')) {
      throw new ForbiddenError('You do not have permission to create tickets');
    }

    const ticket = await Ticket.create({
      orgId,
      projectId,
      title,
      description,
      type,
      priority,
      reporterId: userId,
      assigneeId: assigneeId || null,
      tags: tags || [],
    });

    // Log audit
    await AuditLog.create({
      orgId,
      actorId: userId,
      action: 'create',
      entityType: 'ticket',
      entityId: ticket._id.toString(),
      metadata: { projectId, title, type },
    });

    return ticket;
  }

  async getTicketById(ticketId: string, userId: string): Promise<any> {
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

    return ticket;
  }

  async listTickets(
    projectId: string,
    userId: string,
    filters: TicketFilters
  ): Promise<PaginatedResponse<ITicket>> {
    // Verify user is project member
    const membership = await ProjectMembership.findOne({
      projectId,
      userId,
    });
    if (!membership) {
      throw new ForbiddenError('You do not have access to this project');
    }

    if (!hasPermission(membership.role as ProjectRole, 'view_tickets')) {
      throw new ForbiddenError('You do not have permission to view tickets');
    }

    // Build query
    const query: any = {
      projectId,
      deletedAt: null,
    };

    // Apply filters
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    if (filters.type) query.type = filters.type;
    if (filters.assignee) query.assigneeId = filters.assignee;

    // Search filter
    if (filters.q) {
      query.$or = [
        { title: { $regex: filters.q, $options: 'i' } },
        { description: { $regex: filters.q, $options: 'i' } },
      ];
    }

    // Pagination
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, Math.max(1, filters.limit || 20));
    const skip = (page - 1) * limit;

    // Sorting
    let sortObj: any = { createdAt: -1 };
    if (filters.sort) {
      const [field, direction] = filters.sort.split(':');
      sortObj = { [field]: direction === 'asc' ? 1 : -1 };
    }

    // Execute query
    const total = await Ticket.countDocuments(query);
    const tickets = await Ticket.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate('reporterId', 'name email')
      .populate('assigneeId', 'name email')
      .lean();

    const pages = Math.ceil(total / limit);

    return {
      data: tickets as any,
      total,
      page,
      limit,
      pages,
    };
  }

  async updateTicket(
    ticketId: string,
    userId: string,
    updates: {
      title?: string;
      description?: string;
      priority?: string;
      assigneeId?: string | null;
      tags?: string[];
    }
  ): Promise<any> {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket || ticket.deletedAt) {
      throw new NotFoundError('Ticket');
    }

    // Verify permission
    const membership = await ProjectMembership.findOne({
      projectId: ticket.projectId,
      userId,
    });
    if (!membership) {
      throw new ForbiddenError('You do not have access to this ticket');
    }

    if (!hasPermission(membership.role as ProjectRole, 'update_ticket')) {
      throw new ForbiddenError('You do not have permission to update tickets');
    }

    Object.assign(ticket, updates);
    await ticket.save();

    // Log audit
    await AuditLog.create({
      orgId: ticket.orgId,
      actorId: userId,
      action: 'update',
      entityType: 'ticket',
      entityId: ticketId,
      metadata: updates,
    });

    return ticket;
  }

  async updateTicketStatus(ticketId: string, userId: string, status: string): Promise<any> {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket || ticket.deletedAt) {
      throw new NotFoundError('Ticket');
    }

    // Verify permission
    const membership = await ProjectMembership.findOne({
      projectId: ticket.projectId,
      userId,
    });
    if (!membership) {
      throw new ForbiddenError('You do not have access to this ticket');
    }

    if (!hasPermission(membership.role as ProjectRole, 'change_status')) {
      throw new ForbiddenError('You do not have permission to change ticket status');
    }

    ticket.status = status as any;
    await ticket.save();

    // Log audit
    await AuditLog.create({
      orgId: ticket.orgId,
      actorId: userId,
      action: 'update_status',
      entityType: 'ticket',
      entityId: ticketId,
      metadata: { newStatus: status },
    });

    return ticket;
  }

  async assignTicket(ticketId: string, userId: string, assigneeId: string | null): Promise<any> {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket || ticket.deletedAt) {
      throw new NotFoundError('Ticket');
    }

    // Verify permission
    const membership = await ProjectMembership.findOne({
      projectId: ticket.projectId,
      userId,
    });
    if (!membership) {
      throw new ForbiddenError('You do not have access to this ticket');
    }

    if (!hasPermission(membership.role as ProjectRole, 'assign_ticket')) {
      throw new ForbiddenError('You do not have permission to assign tickets');
    }

    // Verify assignee is a project member (if assigning to someone)
    if (assigneeId) {
      const assigneeMembership = await ProjectMembership.findOne({
        projectId: ticket.projectId,
        userId: assigneeId,
      });
      if (!assigneeMembership) {
        throw new ForbiddenError('Assignee is not a member of this project');
      }
    }

    ticket.assigneeId = assigneeId || undefined;
    await ticket.save();

    // Create notification if assigning to someone
    if (assigneeId) {
      const { Notification } = await import('../models/Notification.js');
      await Notification.create({
        userId: assigneeId,
        orgId: ticket.orgId,
        ticketId,
        type: 'ticket_assigned',
        read: false,
      });
    }

    // Log audit
    await AuditLog.create({
      orgId: ticket.orgId,
      actorId: userId,
      action: 'assign',
      entityType: 'ticket',
      entityId: ticketId,
      metadata: { assigneeId },
    });

    return ticket;
  }

  async deleteTicket(ticketId: string, userId: string) {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket || ticket.deletedAt) {
      throw new NotFoundError('Ticket');
    }

    // Verify permission
    const membership = await ProjectMembership.findOne({
      projectId: ticket.projectId,
      userId,
    });
    if (!membership) {
      throw new ForbiddenError('You do not have access to this ticket');
    }

    if (!hasPermission(membership.role as ProjectRole, 'delete_ticket')) {
      throw new ForbiddenError('You do not have permission to delete tickets');
    }

    ticket.deletedAt = new Date();
    await ticket.save();

    // Log audit
    await AuditLog.create({
      orgId: ticket.orgId,
      actorId: userId,
      action: 'delete',
      entityType: 'ticket',
      entityId: ticketId,
    });
  }
}
