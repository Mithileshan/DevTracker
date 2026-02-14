import { Request, Response, NextFunction } from 'express';
import { OrgService } from '@/services/OrgService';
import { CreateOrgSchema, UpdateOrgSchema, AddOrgMemberSchema } from 'shared/schemas';
import { ValidationError } from '@/utils/errors';
import { ApiSuccess } from 'shared/types';

const orgService = new OrgService();

export class OrgController {
  async createOrg(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      const parsed = CreateOrgSchema.safeParse(req.body);
      if (!parsed.success) {
        const details = parsed.error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        throw new ValidationError('Validation failed', details);
      }

      const org = await orgService.createOrg(
        req.user.userId,
        parsed.data.name,
        parsed.data.description
      );

      const response: ApiSuccess<any> = {
        success: true,
        data: org,
        message: 'Organization created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getOrg(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      const org = await orgService.getOrgById(req.params.orgId, req.user.userId);

      const response: ApiSuccess<any> = {
        success: true,
        data: org,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getUserOrgs(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      const orgs = await orgService.getUserOrgs(req.user.userId);

      const response: ApiSuccess<any> = {
        success: true,
        data: orgs,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async listMembers(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ValidationError('Not authenticated');

      const members = await orgService.listOrgMembers(req.params.orgId, req.user.userId);

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

      const parsed = AddOrgMemberSchema.safeParse(req.body);
      if (!parsed.success) {
        const details = parsed.error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        throw new ValidationError('Validation failed', details);
      }

      const membership = await orgService.addOrgMember(
        req.params.orgId,
        req.user.userId,
        parsed.data.email,
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

      await orgService.removeOrgMember(req.params.orgId, req.user.userId, req.params.memberId);

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

      const membership = await orgService.updateOrgMemberRole(
        req.params.orgId,
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
}
