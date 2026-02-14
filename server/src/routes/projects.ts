import { Router } from 'express';
import { ProjectController } from '@/controllers/ProjectController';
import { authenticate } from '@/middleware/authenticate';

const router = Router({ mergeParams: true });
const projectController = new ProjectController();

// All project routes require authentication
router.use(authenticate);

/**
 * POST /api/orgs/:orgId/projects
 * Create project
 */
router.post('/', (req, res, next) => projectController.createProject(req, res, next));

/**
 * GET /api/orgs/:orgId/projects
 * List organization projects
 */
router.get('/', (req, res, next) => projectController.listProjects(req, res, next));

/**
 * GET /api/projects/:projectId
 * Get project details
 */
router.get('/:projectId', (req, res, next) => projectController.getProject(req, res, next));

/**
 * GET /api/projects/:projectId/members
 * List project members
 */
router.get('/:projectId/members', (req, res, next) => projectController.listMembers(req, res, next));

/**
 * POST /api/projects/:projectId/members
 * Add member to project
 */
router.post('/:projectId/members', (req, res, next) =>
  projectController.addMember(req, res, next)
);

/**
 * DELETE /api/projects/:projectId/members/:memberId
 * Remove member from project
 */
router.delete('/:projectId/members/:memberId', (req, res, next) =>
  projectController.removeMember(req, res, next)
);

/**
 * PATCH /api/projects/:projectId/members/:memberId
 * Update project member role
 */
router.patch('/:projectId/members/:memberId', (req, res, next) =>
  projectController.updateMemberRole(req, res, next)
);

/**
 * POST /api/projects/:projectId/archive
 * Archive project
 */
router.post('/:projectId/archive', (req, res, next) =>
  projectController.archiveProject(req, res, next)
);

export default router;
