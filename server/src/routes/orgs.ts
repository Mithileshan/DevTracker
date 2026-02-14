import { Router } from 'express';
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
router.post('/', (req: any, res: any, next: any) => orgController.createOrg(req, res, next));

/**
 * GET /api/orgs
 * List user's organizations
 */
router.get('/', (req: any, res: any, next: any) => orgController.getUserOrgs(req, res, next));

/**
 * GET /api/orgs/:orgId
 * Get organization details
 */
router.get('/:orgId', (req, res, next) => orgController.getOrg(req, res, next));

/**
 * GET /api/orgs/:orgId/members
 * List organization members
 */
router.get('/:orgId/members', (req, res, next) => orgController.listMembers(req, res, next));

/**
 * POST /api/orgs/:orgId/members
 * Add member to organization
 */
router.post('/:orgId/members', (req, res, next) => orgController.addMember(req, res, next));

/**
 * DELETE /api/orgs/:orgId/members/:memberId
 * Remove member from organization
 */
router.delete('/:orgId/members/:memberId', (req, res, next) =>
  orgController.removeMember(req, res, next)
);

/**
 * PATCH /api/orgs/:orgId/members/:memberId
 * Update member role
 */
router.patch('/:orgId/members/:memberId', (req, res, next) =>
  orgController.updateMemberRole(req, res, next)
);

export default router;
