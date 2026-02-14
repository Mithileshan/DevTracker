// ============ User Types ============
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserPublic {
  _id: string;
  name: string;
  email: string;
}

// ============ Organization Types ============
export interface IOrganization {
  _id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrgMembership {
  _id: string;
  orgId: string;
  userId: string;
  role: 'org_owner' | 'org_admin' | 'org_member';
  joinedAt: Date;
}

// ============ Project Types ============
export interface IProject {
  _id: string;
  orgId: string;
  name: string;
  key: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date;
}

export interface IProjectMembership {
  _id: string;
  projectId: string;
  userId: string;
  role: 'owner' | 'admin' | 'developer' | 'tester' | 'viewer';
  joinedAt: Date;
}

// ============ Ticket Types ============
export interface ITicket {
  _id: string;
  orgId: string;
  projectId: string;
  title: string;
  description: string;
  type: 'bug' | 'task' | 'feature';
  status: 'open' | 'in_progress' | 'blocked' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  reporterId: string;
  assigneeId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// ============ Comment Types ============
export interface ITicketComment {
  _id: string;
  ticketId: string;
  authorId: string;
  body: string;
  mentions: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ============ Notification Types ============
export interface INotification {
  _id: string;
  userId: string;
  orgId: string;
  type: 'ticket_assigned' | 'ticket_mentioned' | 'comment_mentioned' | 'status_changed';
  payload: Record<string, any>;
  readAt?: Date;
  createdAt: Date;
}

// ============ Audit Log Types ============
export interface IAuditLog {
  _id: string;
  orgId: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

// ============ API Response Types ============
export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>[];
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ============ Pagination ============
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// ============ Ticket Filters ============
// Note: TicketFilters type is exported from schemas.ts (Zod-derived from TicketFilterSchema)

// ============ Permission/RBAC ============
export enum OrgRole {
  OWNER = 'org_owner',
  ADMIN = 'org_admin',
  MEMBER = 'org_member',
}

export enum ProjectRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  DEVELOPER = 'developer',
  TESTER = 'tester',
  VIEWER = 'viewer',
}

// ============ Enum Types ============
export enum TicketType {
  BUG = 'bug',
  TASK = 'task',
  FEATURE = 'feature',
}

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  BLOCKED = 'blocked',
  DONE = 'done',
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}
