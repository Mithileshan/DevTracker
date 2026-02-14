import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '@/services/ProjectService';
import { CreateProjectSchema, AddProjectMemberSchema } from 'shared/schemas';
import { ValidationError } from '@/utils/errors';
import { ApiSuccess } from 'shared/types';

const projectService = new ProjectService();

export class ProjectController {
  async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      const parsed = CreateProjectSchema.safeParse(req.body);
      if (!parsed.success) {
        const details = parsed.error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        throw new ValidationError('Validation failed', details);
      }

      const project = await projectService.createProject(
        req.params.orgId,
        req.user.userId,
        parsed.data.name,
        parsed.data.key,
        parsed.data.description
      );

      const response: ApiSuccess<any> = {
        success: true,
        data: project,
        message: 'Project created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getProject(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      const project = await projectService.getProjectById(req.params.projectId, req.user.userId);

      const response: ApiSuccess<any> = {
        success: true,
        data: project,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async listProjects(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      const projects = await projectService.listOrgProjects(req.params.orgId, req.user.userId);

      const response: ApiSuccess<any> = {
        success: true,
        data: projects,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async listMembers(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      const members = await projectService.listProjectMembers(req.params.projectId, req.user.userId);

      const response: ApiSuccess<any> = {
        success: true,
        data: members,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async addMember(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      const parsed = AddProjectMemberSchema.safeParse(req.body);
      if (!parsed.success) {
        const details = parsed.error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        throw new ValidationError('Validation failed', details);
      }

      const membership = await projectService.addProjectMember(
        req.params.projectId,
        req.user.userId,
        parsed.data.userId,
        parsed.data.role
      );

      const response: ApiSuccess<any> = {
        success: true,
        data: membership,
        message: 'Member added successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async removeMember(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      await projectService.removeProjectMember(
        req.params.projectId,
        req.user.userId,
        req.params.memberId
      );

      const response: ApiSuccess<null> = {
        success: true,
        data: null,
        message: 'Member removed successfully',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateMemberRole(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      const { role } = req.body;
      if (!role) {
        throw new ValidationError('Role is required');
      }

      const membership = await projectService.updateProjectMemberRole(
        req.params.projectId,
        req.user.userId,
        req.params.memberId,
        role
      );

      const response: ApiSuccess<any> = {
        success: true,
        data: membership,
        message: 'Member role updated successfully',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async archiveProject(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      const project = await projectService.archiveProject(req.params.projectId, req.user.userId);

      const response: ApiSuccess<any> = {
        success: true,
        data: project,
        message: 'Project archived successfully',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
