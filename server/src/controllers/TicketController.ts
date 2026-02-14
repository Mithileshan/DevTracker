import { Request, Response, NextFunction } from 'express';
import { TicketService } from '@/services/TicketService';
import {
  CreateTicketSchema,
  UpdateTicketSchema,
  UpdateTicketStatusSchema,
  AssignTicketSchema,
  TicketFilterSchema,
} from 'shared/schemas';
import { ValidationError } from '@/utils/errors';
import { ApiSuccess } from 'shared/types';

const ticketService = new TicketService();

export class TicketController {
  async createTicket(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      const parsed = CreateTicketSchema.safeParse(req.body);
      if (!parsed.success) {
        const details = parsed.error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        throw new ValidationError('Validation failed', details);
      }

      const ticket = await ticketService.createTicket(
        req.params.orgId,
        req.params.projectId,
        req.user.userId,
        parsed.data.title,
        parsed.data.description,
        parsed.data.type,
        parsed.data.priority,
        parsed.data.tags,
        parsed.data.assigneeId || undefined
      );

      const response: ApiSuccess<any> = {
        success: true,
        data: ticket,
        message: 'Ticket created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getTicket(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      const ticket = await ticketService.getTicketById(req.params.ticketId, req.user.userId);

      const response: ApiSuccess<any> = {
        success: true,
        data: ticket,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async listTickets(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      const parsed = TicketFilterSchema.safeParse(req.query);
      if (!parsed.success) {
        throw new ValidationError('Invalid filters');
      }

      const tickets = await ticketService.listTickets(
        req.params.projectId,
        req.user.userId,
        parsed.data
      );

      const response: ApiSuccess<any> = {
        success: true,
        data: tickets,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateTicket(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      const parsed = UpdateTicketSchema.safeParse(req.body);
      if (!parsed.success) {
        const details = parsed.error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        throw new ValidationError('Validation failed', details);
      }

      const ticket = await ticketService.updateTicket(req.params.ticketId, req.user.userId, {
        title: parsed.data.title,
        description: parsed.data.description,
        priority: parsed.data.priority,
        assigneeId: parsed.data.assigneeId,
        tags: parsed.data.tags,
      });

      const response: ApiSuccess<any> = {
        success: true,
        data: ticket,
        message: 'Ticket updated successfully',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      const parsed = UpdateTicketStatusSchema.safeParse(req.body);
      if (!parsed.success) {
        const details = parsed.error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        throw new ValidationError('Validation failed', details);
      }

      const ticket = await ticketService.updateTicketStatus(
        req.params.ticketId,
        req.user.userId,
        parsed.data.status
      );

      const response: ApiSuccess<any> = {
        success: true,
        data: ticket,
        message: 'Ticket status updated successfully',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async assignTicket(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      const parsed = AssignTicketSchema.safeParse(req.body);
      if (!parsed.success) {
        const details = parsed.error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        throw new ValidationError('Validation failed', details);
      }

      const ticket = await ticketService.assignTicket(
        req.params.ticketId,
        req.user.userId,
        parsed.data.assigneeId || null
      );

      const response: ApiSuccess<any> = {
        success: true,
        data: ticket,
        message: 'Ticket assigned successfully',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteTicket(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      await ticketService.deleteTicket(req.params.ticketId, req.user.userId);

      const response: ApiSuccess<null> = {
        success: true,
        data: null,
        message: 'Ticket deleted successfully',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
