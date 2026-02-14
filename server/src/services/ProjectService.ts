import { Project } from '@/models/Project';
import { ProjectMembership } from '@/models/ProjectMembership';
import { OrgMembership } from '@/models/OrgMembership';
import { AuditLog } from '@/models/AuditLog';
import { NotFoundError, ForbiddenError, ConflictError, ValidationError } from '@/utils/errors';
import { hasPermission, ProjectRole } from '@/utils/rbac';

export class ProjectService {
  async createProject(
    orgId: string,
    userId: string,
    name: string,
    key: string,
    description?: string
  ): Promise<any> {
    // Verify user is org member
    const orgMember = await OrgMembership.findOne({ orgId, userId });
    if (!orgMember) {
      throw new ForbiddenError('You do not have access to this organization');
    }

    // Check if project key is unique within org
    const existingProject = await Project.findOne({ orgId, key });
    if (existingProject) {
      throw new ConflictError('Project key already exists in this organization');
    }

    const project = await Project.create({
      orgId,
      name,
      key,
      description,
    });

    // Add creator as owner
    await ProjectMembership.create({
      projectId: project._id,
      userId,
      role: ProjectRole.OWNER,
    });

    // Log audit
    await AuditLog.create({
      orgId,
      actorId: userId,
      action: 'create',
      entityType: 'project',
      entityId: project._id.toString(),
      metadata: { name, key },
    });

    return project;
  }

  async getProjectById(projectId: string, userId: string): Promise<any> {
    const project = await Project.findById(projectId);
    if (!project || project.archivedAt) {
      throw new NotFoundError('Project');
    }

    // Verify user is member
    const membership = await ProjectMembership.findOne({
      projectId: project._id,
      userId,
    });
    if (!membership) {
      throw new ForbiddenError('You do not have access to this project');
    }

    return project;
  }

  async listOrgProjects(orgId: string, userId: string): Promise<any[]> {
    // Verify user is org member
    const orgMember = await OrgMembership.findOne({ orgId, userId });
    if (!orgMember) {
      throw new ForbiddenError('You do not have access to this organization');
    }

    const projects = await Project.find({
      orgId,
      archivedAt: null,
    });

    return projects;
  }

  async listProjectMembers(projectId: string, userId: string): Promise<any[]> {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new NotFoundError('Project');
    }

    // Verify user is member
    const userMembership = await ProjectMembership.findOne({
      projectId,
      userId,
    });
    if (!userMembership) {
      throw new ForbiddenError('You do not have access to this project');
    }

    const memberships = await ProjectMembership.find({ projectId })
      .populate('userId', 'name email')
      .lean();

    return memberships;
  }

  async addProjectMember(
    projectId: string,
    userId: string,
    newMemberId: string,
    role: string
  ): Promise<any> {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new NotFoundError('Project');
    }

    // Verify user has permission
    const userMembership = await ProjectMembership.findOne({
      projectId,
      userId,
    });
    if (!userMembership) {
      throw new ForbiddenError('You do not have access to this project');
    }

    if (!hasPermission(userMembership.role as ProjectRole, 'add_member')) {
      throw new ForbiddenError('You do not have permission to add members');
    }

    // Check if already member
    const existing = await ProjectMembership.findOne({
      projectId,
      userId: newMemberId,
    });
    if (existing) {
      throw new ConflictError('User is already a member of this project');
    }

    const membership = await ProjectMembership.create({
      projectId,
      userId: newMemberId,
      role,
    });

    // Log audit
    await AuditLog.create({
      orgId: project.orgId,
      actorId: userId,
      action: 'add_member',
      entityType: 'project_membership',
      entityId: membership._id.toString(),
      metadata: { projectId, addedUserId: newMemberId, role },
    });

    return membership;
  }

  async removeProjectMember(projectId: string, userId: string, memberId: string) {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new NotFoundError('Project');
    }

    // Verify user has permission
    const userMembership = await ProjectMembership.findOne({
      projectId,
      userId,
    });
    if (!userMembership) {
      throw new ForbiddenError('You do not have access to this project');
    }

    if (!hasPermission(userMembership.role as ProjectRole, 'remove_member')) {
      throw new ForbiddenError('You do not have permission to remove members');
    }

    const membership = await ProjectMembership.findById(memberId);
    if (!membership || membership.projectId.toString() !== projectId) {
      throw new NotFoundError('Membership');
    }

    // Cannot remove the last owner
    if (membership.role === ProjectRole.OWNER) {
      const ownerCount = await ProjectMembership.countDocuments({
        projectId,
        role: ProjectRole.OWNER,
      });
      if (ownerCount === 1) {
        throw new ValidationError('Cannot remove the last owner');
      }
    }

    await ProjectMembership.findByIdAndDelete(memberId);

    // Log audit
    await AuditLog.create({
      orgId: project.orgId,
      actorId: userId,
      action: 'remove_member',
      entityType: 'project_membership',
      entityId: memberId,
      metadata: { projectId, removedUserId: membership.userId },
    });
  }

  async updateProjectMemberRole(
    projectId: string,
    userId: string,
    memberId: string,
    newRole: string
  ): Promise<any> {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new NotFoundError('Project');
    }

    // Verify user has permission
    const userMembership = await ProjectMembership.findOne({
      projectId,
      userId,
    });
    if (!userMembership) {
      throw new ForbiddenError('You do not have access to this project');
    }

    if (!hasPermission(userMembership.role as ProjectRole, 'update_member_role')) {
      throw new ForbiddenError('You do not have permission to update member roles');
    }

    const membership = await ProjectMembership.findById(memberId);
    if (!membership || membership.projectId.toString() !== projectId) {
      throw new NotFoundError('Membership');
    }

    const oldRole = membership.role;
    membership.role = newRole as any;
    await membership.save();

    // Log audit
    await AuditLog.create({
      orgId: project.orgId,
      actorId: userId,
      action: 'update_member_role',
      entityType: 'project_membership',
      entityId: memberId,
      metadata: { projectId, userId: membership.userId, oldRole, newRole },
    });

    return membership;
  }

  async archiveProject(projectId: string, userId: string): Promise<any> {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new NotFoundError('Project');
    }

    // Verify user is owner
    const userMembership = await ProjectMembership.findOne({
      projectId,
      userId,
    });
    if (!userMembership || userMembership.role !== ProjectRole.OWNER) {
      throw new ForbiddenError('Only project owners can archive projects');
    }

    project.archivedAt = new Date();
    await project.save();

    // Log audit
    await AuditLog.create({
      orgId: project.orgId,
      actorId: userId,
      action: 'archive',
      entityType: 'project',
      entityId: projectId,
    });

    return project;
  }
}
