import { Router, Request, Response, NextFunction } from 'express';
import { TicketController } from '@/controllers/TicketController';
import { authenticate } from '@/middleware/authenticate';

const router = Router({ mergeParams: true });
const ticketController = new TicketController();

// All ticket routes require authentication
router.use(authenticate);

/**
 * POST /api/orgs/:orgId/projects/:projectId/tickets
 * Create ticket
 */
router.post('/', (req: Request, res: Response, next: NextFunction) => ticketController.createTicket(req, res, next));

/**
 * GET /api/orgs/:orgId/projects/:projectId/tickets
 * List tickets with filters and pagination
 */
router.get('/', (req: Request, res: Response, next: NextFunction) => ticketController.listTickets(req, res, next));

/**
 * GET /api/tickets/:ticketId
 * Get ticket details
 */
router.get('/:ticketId', (req: Request, res: Response, next: NextFunction) => ticketController.getTicket(req, res, next));

/**
 * PATCH /api/tickets/:ticketId
 * Update ticket
 */
router.patch('/:ticketId', (req: Request, res: Response, next: NextFunction) => ticketController.updateTicket(req, res, next));

/**
 * POST /api/tickets/:ticketId/status
 * Update ticket status
 */
router.post('/:ticketId/status', (req: Request, res: Response, next: NextFunction) => ticketController.updateStatus(req, res, next));

/**
 * POST /api/tickets/:ticketId/assign
 * Assign ticket
 */
router.post('/:ticketId/assign', (req: Request, res: Response, next: NextFunction) => ticketController.assignTicket(req, res, next));

/**
 * DELETE /api/tickets/:ticketId
 * Delete ticket (soft delete)
 */
router.delete('/:ticketId', (req: Request, res: Response, next: NextFunction) => ticketController.deleteTicket(req, res, next));

export default router;
