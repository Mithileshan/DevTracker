import { ProjectRole } from 'shared/types';

// Re-export for convenience
export { ProjectRole };

// Centralized RBAC permission map
export const permissionMap: Record<ProjectRole, Set<string>> = {
  [ProjectRole.OWNER]: new Set([
    'create_ticket',
    'update_ticket',
    'delete_ticket',
    'assign_ticket',
    'change_status',
    'add_member',
    'remove_member',
    'update_member_role',
    'archive_project',
    'view_members',
    'view_tickets',
  ]),
  [ProjectRole.ADMIN]: new Set([
    'create_ticket',
    'update_ticket',
    'delete_ticket',
    'assign_ticket',
    'change_status',
    'add_member',
    'remove_member',
    'update_member_role',
    'view_members',
    'view_tickets',
  ]),
  [ProjectRole.DEVELOPER]: new Set([
    'create_ticket',
    'update_ticket',
    'assign_ticket',
    'change_status',
    'view_members',
    'view_tickets',
  ]),
  [ProjectRole.TESTER]: new Set([
    'create_ticket',
    'update_ticket',
    'change_status',
    'view_members',
    'view_tickets',
  ]),
  [ProjectRole.VIEWER]: new Set(['view_members', 'view_tickets']),
};

export const hasPermission = (role: ProjectRole, action: string): boolean => {
  return permissionMap[role]?.has(action) ?? false;
};

export const requirePermission =
  (action: string) => (userRole: ProjectRole): boolean => {
    return hasPermission(userRole, action);
  };
