import { z } from 'zod';

// ============ Auth Schemas ============
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// ============ Organization Schemas ============
export const CreateOrgSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
  description: z.string().optional(),
});

export const UpdateOrgSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters').optional(),
  description: z.string().optional(),
});

export const AddOrgMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['org_owner', 'org_admin', 'org_member']),
});

// ============ Project Schemas ============
export const CreateProjectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  key: z.string().min(2).max(10, 'Project key must be 2-10 characters'),
  description: z.string().optional(),
});

export const UpdateProjectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters').optional(),
  description: z.string().optional(),
});

export const AddProjectMemberSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.enum(['owner', 'admin', 'developer', 'tester', 'viewer']),
});

// ============ Ticket Schemas ============
export const CreateTicketSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  type: z.enum(['bug', 'task', 'feature']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  tags: z.array(z.string()).optional(),
  assigneeId: z.string().optional().nullable(),
});

export const UpdateTicketSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').optional(),
  description: z.string().min(5, 'Description must be at least 5 characters').optional(),
  status: z.enum(['open', 'in_progress', 'blocked', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  assigneeId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

export const UpdateTicketStatusSchema = z.object({
  status: z.enum(['open', 'in_progress', 'blocked', 'done']),
});

export const AssignTicketSchema = z.object({
  assigneeId: z.string().nullable().optional(),
});

export const TicketFilterSchema = z.object({
  status: z.enum(['open', 'in_progress', 'blocked', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  assignee: z.string().optional(),
  type: z.enum(['bug', 'task', 'feature']).optional(),
  q: z.string().optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  sort: z.string().optional(),
});

// ============ Comment Schemas ============
export const CreateCommentSchema = z.object({
  body: z.string().min(1, 'Comment cannot be empty'),
  mentions: z.array(z.string()).optional(),
});

export const UpdateCommentSchema = z.object({
  body: z.string().min(1, 'Comment cannot be empty'),
});

// ============ Notification Schemas ============
export const NotificationFilterSchema = z.object({
  read: z.boolean().optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
});

// ============ Type Exports ============
export type LoginRequest = z.infer<typeof LoginSchema>;
export type RegisterRequest = z.infer<typeof RegisterSchema>;
export type CreateOrgRequest = z.infer<typeof CreateOrgSchema>;
export type CreateProjectRequest = z.infer<typeof CreateProjectSchema>;
export type CreateTicketRequest = z.infer<typeof CreateTicketSchema>;
export type UpdateTicketRequest = z.infer<typeof UpdateTicketSchema>;
export type CreateCommentRequest = z.infer<typeof CreateCommentSchema>;
export type TicketFilters = z.infer<typeof TicketFilterSchema>;
