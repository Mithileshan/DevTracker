import Invite, { generateInviteToken, hashToken } from '@/models/Invite';
import { OrgMembership } from '@/models/OrgMembership';
import { User } from '@/models/User';
import { Organization } from '@/models/Organization';
import { log } from '@/config/logger';
import { sendInviteEmail } from '@/config/mailer';
import mongoose from 'mongoose';

interface CreateInviteInput {
  orgId: string;
  email: string;
  role: 'org_owner' | 'org_admin' | 'org_member';
  projectId?: string;
  createdBy: string; // userId
}

interface VerifyInviteResponse {
  valid: boolean;
  orgName?: string;
  role?: string;
  email?: string;
  message?: string;
}

interface AcceptInviteInput {
  token: string;
  userId: string;
}

export class InviteService {
  /**
   * Create and send an invite
   */
  static async createInvite(input: CreateInviteInput, frontendUrl: string): Promise<string> {
    const { orgId, email, role, createdBy } = input;

    // Validate org exists
    const org = await Organization.findById(orgId);
    if (!org) {
      throw new Error('Organization not found');
    }

    // Validate creator has permission (owner/admin)
    const membership = await OrgMembership.findOne({
      orgId,
      userId: createdBy,
    });

    if (!membership || !['org_owner', 'org_admin'].includes(membership.role)) {
      throw new Error('Only org owner/admin can invite members');
    }

    // Check if invite already exists (active only)
    const existingInvite = await Invite.findOne({
      orgId,
      email,
      acceptedAt: null,
    });

    if (existingInvite) {
      throw new Error('Active invite already exists for this email');
    }

    // Check if user already member
    const existingMember = await OrgMembership.findOne({
      orgId,
      email,
    });

    if (existingMember) {
      throw new Error('User is already a member of this organization');
    }

    // Generate token
    const rawToken = generateInviteToken();
    const tokenHash = hashToken(rawToken);

    // Create invite (expires in 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invite = new Invite({
      orgId: new mongoose.Types.ObjectId(orgId),
      projectId: input.projectId ? new mongoose.Types.ObjectId(input.projectId) : null,
      email,
      role,
      tokenHash,
      expiresAt,
      createdBy: new mongoose.Types.ObjectId(createdBy),
    });

    await invite.save();

    // Send invite email
    const inviteLink = `${frontendUrl}/invite/${rawToken}`;
    const creator = await User.findById(createdBy);
    const creatorName = creator?.name || 'A team member';

    try {
      await sendInviteEmail(email, org.name, creatorName, rawToken, inviteLink);
      log.info(`Invite sent to ${email} for org ${orgId}`);
    } catch (error) {
      log.error('Failed to send invite email', { email, error });
      // Don't throw - invite is created even if email fails (admin can retry)
    }

    return invite._id.toString();
  }

  /**
   * Verify invite token
   */
  static async verifyInvite(rawToken: string): Promise<VerifyInviteResponse> {
    if (!rawToken) {
      return { valid: false, message: 'Token required' };
    }

    const tokenHash = hashToken(rawToken);

    const invite = await Invite.findOne({ tokenHash }).populate('orgId');

    if (!invite) {
      return { valid: false, message: 'Invalid or expired invite' };
    }

    // Check expiration
    if (new Date() > invite.expiresAt) {
      return { valid: false, message: 'Invite has expired' };
    }

    // Check if already accepted
    if (invite.acceptedAt) {
      return { valid: false, message: 'Invite already accepted' };
    }

    const org = invite.orgId as any;
    return {
      valid: true,
      orgName: org?.name,
      role: invite.role,
      email: invite.email,
    };
  }

  /**
   * Accept invite and create org membership
   */
  static async acceptInvite(input: AcceptInviteInput): Promise<void> {
    const { token, userId } = input;

    const tokenHash = hashToken(token);

    const invite = await Invite.findOne({ tokenHash });

    if (!invite) {
      throw new Error('Invalid or expired invite');
    }

    // Check expiration
    if (new Date() > invite.expiresAt) {
      throw new Error('Invite has expired');
    }

    // Check if already accepted
    if (invite.acceptedAt) {
      throw new Error('Invite already accepted');
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check email matches
    if (user.email.toLowerCase() !== invite.email.toLowerCase()) {
      throw new Error('Email mismatch. Accept invite with the correct account.');
    }

    // Create membership
    const existingMembership = await OrgMembership.findOne({
      orgId: invite.orgId,
      userId,
    });

    if (!existingMembership) {
      const membership = new OrgMembership({
        orgId: invite.orgId,
        userId,
        role: invite.role,
        joinedAt: new Date(),
      });
      await membership.save();
    }

    // Mark invite as accepted
    invite.acceptedAt = new Date();
    invite.acceptedBy = new mongoose.Types.ObjectId(userId);
    await invite.save();

    const org = await Organization.findById(invite.orgId);
    log.info(`User ${userId} accepted invite to org ${invite.orgId}`, {
      orgName: org?.name,
    });
  }

  /**
   * List pending invites for org
   */
  static async getOrgInvites(orgId: string): Promise<any[]> {
    const invites = await Invite.find({
      orgId,
      acceptedAt: null,
    })
      .sort({ createdAt: -1 })
      .select('email role expiresAt createdAt createdBy')
      .populate('createdBy', 'name email');

    return invites;
  }

  /**
   * Cancel an invite
   */
  static async cancelInvite(inviteId: string, userId: string): Promise<void> {
    const invite = await Invite.findById(inviteId);

    if (!invite) {
      throw new Error('Invite not found');
    }

    // Only creator or org admin can cancel
    const membership = await OrgMembership.findOne({
      orgId: invite.orgId,
      userId,
    });

    if (
      !membership ||
      (invite.createdBy.toString() !== userId && membership.role !== 'org_admin' && membership.role !== 'org_owner')
    ) {
      throw new Error('Not authorized to cancel this invite');
    }

    await Invite.findByIdAndDelete(inviteId);
    log.info(`Invite ${inviteId} cancelled by ${userId}`);
  }
}
