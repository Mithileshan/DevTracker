"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationFilterSchema = exports.UpdateCommentSchema = exports.CreateCommentSchema = exports.TicketFilterSchema = exports.AssignTicketSchema = exports.UpdateTicketStatusSchema = exports.UpdateTicketSchema = exports.CreateTicketSchema = exports.AddProjectMemberSchema = exports.UpdateProjectSchema = exports.CreateProjectSchema = exports.AddOrgMemberSchema = exports.UpdateOrgSchema = exports.CreateOrgSchema = exports.RefreshTokenSchema = exports.RegisterSchema = exports.LoginSchema = void 0;
const zod_1 = require("zod");
// ============ Auth Schemas ============
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.RegisterSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.RefreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, 'Refresh token is required'),
});
// ============ Organization Schemas ============
exports.CreateOrgSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Organization name must be at least 2 characters'),
    description: zod_1.z.string().optional(),
});
exports.UpdateOrgSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Organization name must be at least 2 characters').optional(),
    description: zod_1.z.string().optional(),
});
exports.AddOrgMemberSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    role: zod_1.z.enum(['org_owner', 'org_admin', 'org_member']),
});
// ============ Project Schemas ============
exports.CreateProjectSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Project name must be at least 2 characters'),
    key: zod_1.z.string().min(2).max(10, 'Project key must be 2-10 characters'),
    description: zod_1.z.string().optional(),
});
exports.UpdateProjectSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Project name must be at least 2 characters').optional(),
    description: zod_1.z.string().optional(),
});
exports.AddProjectMemberSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, 'User ID is required'),
    role: zod_1.z.enum(['owner', 'admin', 'developer', 'tester', 'viewer']),
});
// ============ Ticket Schemas ============
exports.CreateTicketSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, 'Title must be at least 3 characters'),
    description: zod_1.z.string().min(5, 'Description must be at least 5 characters'),
    type: zod_1.z.enum(['bug', 'task', 'feature']),
    priority: zod_1.z.enum(['low', 'medium', 'high', 'critical']),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    assigneeId: zod_1.z.string().optional().nullable(),
});
exports.UpdateTicketSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, 'Title must be at least 3 characters').optional(),
    description: zod_1.z.string().min(5, 'Description must be at least 5 characters').optional(),
    status: zod_1.z.enum(['open', 'in_progress', 'blocked', 'done']).optional(),
    priority: zod_1.z.enum(['low', 'medium', 'high', 'critical']).optional(),
    assigneeId: zod_1.z.string().optional().nullable(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.UpdateTicketStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['open', 'in_progress', 'blocked', 'done']),
});
exports.AssignTicketSchema = zod_1.z.object({
    assigneeId: zod_1.z.string().nullable().optional(),
});
exports.TicketFilterSchema = zod_1.z.object({
    status: zod_1.z.enum(['open', 'in_progress', 'blocked', 'done']).optional(),
    priority: zod_1.z.enum(['low', 'medium', 'high', 'critical']).optional(),
    assignee: zod_1.z.string().optional(),
    type: zod_1.z.enum(['bug', 'task', 'feature']).optional(),
    q: zod_1.z.string().optional(),
    page: zod_1.z.string().transform(Number).optional(),
    limit: zod_1.z.string().transform(Number).optional(),
    sort: zod_1.z.string().optional(),
});
// ============ Comment Schemas ============
exports.CreateCommentSchema = zod_1.z.object({
    body: zod_1.z.string().min(1, 'Comment cannot be empty'),
    mentions: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.UpdateCommentSchema = zod_1.z.object({
    body: zod_1.z.string().min(1, 'Comment cannot be empty'),
});
// ============ Notification Schemas ============
exports.NotificationFilterSchema = zod_1.z.object({
    read: zod_1.z.boolean().optional(),
    page: zod_1.z.string().transform(Number).optional(),
    limit: zod_1.z.string().transform(Number).optional(),
});
//# sourceMappingURL=schemas.js.map