import { Router, Request, Response, NextFunction } from 'express';
import { OrgController } from '@/controllers/OrgController';
import { authenticate } from '@/middleware/authenticate';

const router = Router();
const orgController = new OrgController();

// All org routes require authentication
router.use(authenticate);

/**
 * POST /api/orgs
 * Create organization
 */
router.post('/', (req: Request, res: Response, next: NextFunction) => orgController.createOrg(req, res, next));

/**
 * GET /api/orgs
 * List user's organizations
 */
router.get('/', (req: Request, res: Response, next: NextFunction) => orgController.getUserOrgs(req, res, next));

/**
 * GET /api/orgs/:orgId
 * Get organization details
 */
router.get('/:orgId', (req: Request, res: Response, next: NextFunction) => orgController.getOrg(req, res, next));

/**
 * GET /api/orgs/:orgId/members
 * List organization members
 */
router.get('/:orgId/members', (req: Request, res: Response, next: NextFunction) => orgController.listMembers(req, res, next));

/**
 * POST /api/orgs/:orgId/members
 * Add member to organization
 */
router.post('/:orgId/members', (req: Request, res: Response, next: NextFunction) => orgController.addMember(req, res, next));

/**
 * DELETE /api/orgs/:orgId/members/:memberId
 * Remove member from organization
 */
router.delete('/:orgId/members/:memberId', (req: Request, res: Response, next: NextFunction) =>
  orgController.removeMember(req, res, next)
);

/**
 * PATCH /api/orgs/:orgId/members/:memberId
 * Update member role
 */
router.patch('/:orgId/members/:memberId', (req: Request, res: Response, next: NextFunction) =>
  orgController.updateMemberRole(req, res, next)
);

export default router;
