import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '@/middleware/authenticate';
import * as inviteController from '@/controllers/InviteController';

const router = Router();

/**
 * @swagger
 * /api/orgs/{orgId}/invites:
 *   post:
 *     summary: Create organization invite
 *     tags: [Invites]
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [org_owner, org_admin, org_member]
 *     responses:
 *       201:
 *         description: Invite created and sent
 */
router.post('/:orgId/invites', authenticate, inviteController.createOrgInvite);

/**
 * @swagger
 * /api/orgs/{orgId}/invites:
 *   get:
 *     summary: List pending organization invites
 *     tags: [Invites]
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of invites
 */
router.get('/:orgId/invites', authenticate, inviteController.getOrgInvites);

/**
 * @swagger
 * /api/invites/{token}/verify:
 *   get:
 *     summary: Verify invite token
 *     tags: [Invites]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invite details
 */
router.get('/verify/:token', inviteController.verifyInvite);

/**
 * @swagger
 * /api/invites/{token}/accept:
 *   post:
 *     summary: Accept organization invite
 *     tags: [Invites]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invite accepted
 */
router.post('/accept/:token', authenticate, inviteController.acceptInvite);

/**
 * @swagger
 * /api/invites/{inviteId}:
 *   delete:
 *     summary: Cancel organization invite
 *     tags: [Invites]
 *     parameters:
 *       - in: path
 *         name: inviteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invite cancelled
 */
router.delete('/:inviteId', authenticate, inviteController.cancelInvite);

export default router;
