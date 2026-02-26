import { Request, Response, NextFunction } from 'express';
import { InviteService } from '@/services/InviteService';
import { log } from '@/config/logger';
import { validateRequest } from '@/utils/errors';
import { z } from 'zod';

// Validation schemas
const createInviteSchema = z.object({
  email: z.string().email('Invalid email'),
  role: z.enum(['org_owner', 'org_admin', 'org_member']),
});

const acceptInviteSchema = z.object({
  token: z.string().min(1, 'Token required'),
});

export async function createOrgInvite(req: Request, res: Response, next: NextFunction) {
  try {
    const { orgId } = req.params;
    const { email, role } = validateRequest(req.body, createInviteSchema);
    const userId = (req as any).user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const inviteId = await InviteService.createInvite(
      {
        orgId,
        email,
        role,
        createdBy: userId.toString(),
      },
      frontendUrl
    );

    res.status(201).json({
      success: true,
      inviteId,
      message: `Invite sent to ${email}`,
    });
  } catch (error: any) {
    log.error('Failed to create invite', error);
    res.status(error.message.includes('permission') ? 403 : 400).json({
      error: error.message,
    });
  }
}

export async function verifyInvite(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ error: 'Token required' });
    }

    const result = await InviteService.verifyInvite(token);

    res.status(result.valid ? 200 : 400).json(result);
  } catch (error: any) {
    log.error('Failed to verify invite', error);
    res.status(400).json({ error: error.message });
  }
}

export async function acceptInvite(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.params;
    const { token: bodyToken } = validateRequest(req.body, acceptInviteSchema);
    const userId = (req as any).user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Use token from params or body
    const inviteToken = token || bodyToken;

    await InviteService.acceptInvite({
      token: inviteToken,
      userId: userId.toString(),
    });

    res.status(200).json({
      success: true,
      message: 'Invite accepted! You are now a member of the organization.',
    });
  } catch (error: any) {
    log.error('Failed to accept invite', error);

    if (error.message.includes('Email mismatch')) {
      return res.status(403).json({ error: error.message });
    }

    if (error.message.includes('expired')) {
      return res.status(410).json({ error: error.message });
    }

    res.status(400).json({ error: error.message });
  }
}

export async function getOrgInvites(req: Request, res: Response, next: NextFunction) {
  try {
    const { orgId } = req.params;
    const userId = (req as any).user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const invites = await InviteService.getOrgInvites(orgId);

    res.status(200).json({
      success: true,
      data: invites,
    });
  } catch (error: any) {
    log.error('Failed to get invites', error);
    res.status(400).json({ error: error.message });
  }
}

export async function cancelInvite(req: Request, res: Response, next: NextFunction) {
  try {
    const { inviteId } = req.params;
    const userId = (req as any).user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    await InviteService.cancelInvite(inviteId, userId.toString());

    res.status(200).json({
      success: true,
      message: 'Invite cancelled',
    });
  } catch (error: any) {
    log.error('Failed to cancel invite', error);
    res.status(error.message.includes('authorized') ? 403 : 400).json({
      error: error.message,
    });
  }
}
