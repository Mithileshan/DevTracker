import { Organization } from '@/models/Organization';
import { OrgMembership } from '@/models/OrgMembership';
import { User } from '@/models/User';
import { AuditLog } from '@/models/AuditLog';
import { NotFoundError, ForbiddenError, ConflictError, ValidationError } from '@/utils/errors';
import { IOrganization, IOrgMembership, IUserPublic, OrgRole } from 'shared/types';

export class OrgService {
  async createOrg(userId: string, name: string, description?: string): Promise<IOrganization | any> {
    const org = await Organization.create({
      name,
      description,
      ownerId: userId,
    });

    // Add creator as owner
    await OrgMembership.create({
      orgId: org._id,
      userId,
      role: OrgRole.OWNER,
    });

    // Log audit
    await AuditLog.create({
      orgId: org._id,
      actorId: userId,
      action: 'create',
      entityType: 'organization',
      entityId: org._id.toString(),
      metadata: { name },
    });

    return org;
  }

  async getOrgById(orgId: string, userId: string): Promise<IOrganization | any> {
    const org = await Organization.findById(orgId);
    if (!org) {
      throw new NotFoundError('Organization');
    }

    // Verify user is member
    const membership = await OrgMembership.findOne({
      orgId: org._id,
      userId,
    });
    if (!membership) {
      throw new ForbiddenError('You do not have access to this organization');
    }

    return org;
  }

  async getUserOrgs(userId: string) {
    const memberships = await OrgMembership.find({ userId }).populate('orgId');
    return memberships.map((m) => ({
      ...m.toObject(),
      org: m.orgId as any,
    }));
  }

  async listOrgMembers(orgId: string, userId: string): Promise<(IOrgMembership | any)[]> {
    // Verify user is member
    const userMembership = await OrgMembership.findOne({
      orgId,
      userId,
    });
    if (!userMembership) {
      throw new ForbiddenError('You do not have access to this organization');
    }

    const memberships = await OrgMembership.find({ orgId })
      .populate('userId', 'name email')
      .lean();

    return memberships;
  }

  async addOrgMember(orgId: string, actorId: string, email: string, role: string): Promise<IOrgMembership | any> {
    // Verify actor is admin or owner
    const actorMembership = await OrgMembership.findOne({
      orgId,
      userId: actorId,
    });
    if (!actorMembership || !['org_owner', 'org_admin'].includes(actorMembership.role)) {
      throw new ForbiddenError('You do not have permission to add members');
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError('User');
    }

    // Check if already member
    const existing = await OrgMembership.findOne({
      orgId,
      userId: user._id,
    });
    if (existing) {
      throw new ConflictError('User is already a member of this organization');
    }

    const membership = await OrgMembership.create({
      orgId,
      userId: user._id,
      role,
    });

    // Log audit
    await AuditLog.create({
      orgId,
      actorId,
      action: 'add_member',
      entityType: 'org_membership',
      entityId: membership._id.toString(),
      metadata: { addedUserId: user._id, role },
    });

    return membership;
  }

  async removeOrgMember(orgId: string, actorId: string, memberId: string) {
    // Verify actor is owner
    const actorMembership = await OrgMembership.findOne({
      orgId,
      userId: actorId,
    });
    if (!actorMembership || actorMembership.role !== OrgRole.OWNER) {
      throw new ForbiddenError('Only organization owners can remove members');
    }

    const membership = await OrgMembership.findById(memberId);
    if (!membership || membership.orgId.toString() !== orgId) {
      throw new NotFoundError('Membership');
    }

    // Cannot remove the last owner
    if (membership.role === OrgRole.OWNER) {
      const ownerCount = await OrgMembership.countDocuments({
        orgId,
        role: OrgRole.OWNER,
      });
      if (ownerCount === 1) {
        throw new ValidationError('Cannot remove the last owner');
      }
    }

    await OrgMembership.findByIdAndDelete(memberId);

    // Log audit
    await AuditLog.create({
      orgId,
      actorId,
      action: 'remove_member',
      entityType: 'org_membership',
      entityId: memberId,
      metadata: { removedUserId: membership.userId },
    });
  }

  async updateOrgMemberRole(
    orgId: string,
    actorId: string,
    memberId: string,
    newRole: string
  ): Promise<IOrgMembership | any> {
    // Verify actor is owner
    const actorMembership = await OrgMembership.findOne({
      orgId,
      userId: actorId,
    });
    if (!actorMembership || actorMembership.role !== OrgRole.OWNER) {
      throw new ForbiddenError('Only organization owners can update member roles');
    }

    const membership = await OrgMembership.findById(memberId);
    if (!membership || membership.orgId.toString() !== orgId) {
      throw new NotFoundError('Membership');
    }

    membership.role = newRole as any;
    await membership.save();

    // Log audit
    await AuditLog.create({
      orgId,
      actorId,
      action: 'update_member_role',
      entityType: 'org_membership',
      entityId: memberId,
      metadata: { userId: membership.userId, oldRole: membership.role, newRole },
    });

    return membership;
  }
}
