import { z } from 'zod';
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const RegisterSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
}, {
    name: string;
    email: string;
    password: string;
}>;
export declare const RefreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export declare const CreateOrgSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
}>;
export declare const UpdateOrgSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
}>;
export declare const AddOrgMemberSchema: z.ZodObject<{
    email: z.ZodString;
    role: z.ZodEnum<["org_owner", "org_admin", "org_member"]>;
}, "strip", z.ZodTypeAny, {
    email: string;
    role: "org_owner" | "org_admin" | "org_member";
}, {
    email: string;
    role: "org_owner" | "org_admin" | "org_member";
}>;
export declare const CreateProjectSchema: z.ZodObject<{
    name: z.ZodString;
    key: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    key: string;
    description?: string | undefined;
}, {
    name: string;
    key: string;
    description?: string | undefined;
}>;
export declare const UpdateProjectSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
}>;
export declare const AddProjectMemberSchema: z.ZodObject<{
    userId: z.ZodString;
    role: z.ZodEnum<["owner", "admin", "developer", "tester", "viewer"]>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    role: "owner" | "admin" | "developer" | "tester" | "viewer";
}, {
    userId: string;
    role: "owner" | "admin" | "developer" | "tester" | "viewer";
}>;
export declare const CreateTicketSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    type: z.ZodEnum<["bug", "task", "feature"]>;
    priority: z.ZodEnum<["low", "medium", "high", "critical"]>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    assigneeId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    type: "bug" | "task" | "feature";
    description: string;
    title: string;
    priority: "low" | "medium" | "high" | "critical";
    tags?: string[] | undefined;
    assigneeId?: string | null | undefined;
}, {
    type: "bug" | "task" | "feature";
    description: string;
    title: string;
    priority: "low" | "medium" | "high" | "critical";
    tags?: string[] | undefined;
    assigneeId?: string | null | undefined;
}>;
export declare const UpdateTicketSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["open", "in_progress", "blocked", "done"]>>;
    priority: z.ZodOptional<z.ZodEnum<["low", "medium", "high", "critical"]>>;
    assigneeId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    status?: "open" | "in_progress" | "blocked" | "done" | undefined;
    title?: string | undefined;
    priority?: "low" | "medium" | "high" | "critical" | undefined;
    tags?: string[] | undefined;
    assigneeId?: string | null | undefined;
}, {
    description?: string | undefined;
    status?: "open" | "in_progress" | "blocked" | "done" | undefined;
    title?: string | undefined;
    priority?: "low" | "medium" | "high" | "critical" | undefined;
    tags?: string[] | undefined;
    assigneeId?: string | null | undefined;
}>;
export declare const UpdateTicketStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["open", "in_progress", "blocked", "done"]>;
}, "strip", z.ZodTypeAny, {
    status: "open" | "in_progress" | "blocked" | "done";
}, {
    status: "open" | "in_progress" | "blocked" | "done";
}>;
export declare const AssignTicketSchema: z.ZodObject<{
    assigneeId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    assigneeId?: string | null | undefined;
}, {
    assigneeId?: string | null | undefined;
}>;
export declare const TicketFilterSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["open", "in_progress", "blocked", "done"]>>;
    priority: z.ZodOptional<z.ZodEnum<["low", "medium", "high", "critical"]>>;
    assignee: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<["bug", "task", "feature"]>>;
    q: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
    limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
    sort: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sort?: string | undefined;
    type?: "bug" | "task" | "feature" | undefined;
    limit?: number | undefined;
    status?: "open" | "in_progress" | "blocked" | "done" | undefined;
    priority?: "low" | "medium" | "high" | "critical" | undefined;
    assignee?: string | undefined;
    q?: string | undefined;
    page?: number | undefined;
}, {
    sort?: string | undefined;
    type?: "bug" | "task" | "feature" | undefined;
    limit?: string | undefined;
    status?: "open" | "in_progress" | "blocked" | "done" | undefined;
    priority?: "low" | "medium" | "high" | "critical" | undefined;
    assignee?: string | undefined;
    q?: string | undefined;
    page?: string | undefined;
}>;
export declare const CreateCommentSchema: z.ZodObject<{
    body: z.ZodString;
    mentions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    body: string;
    mentions?: string[] | undefined;
}, {
    body: string;
    mentions?: string[] | undefined;
}>;
export declare const UpdateCommentSchema: z.ZodObject<{
    body: z.ZodString;
}, "strip", z.ZodTypeAny, {
    body: string;
}, {
    body: string;
}>;
export declare const NotificationFilterSchema: z.ZodObject<{
    read: z.ZodOptional<z.ZodBoolean>;
    page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
    limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
}, "strip", z.ZodTypeAny, {
    limit?: number | undefined;
    page?: number | undefined;
    read?: boolean | undefined;
}, {
    limit?: string | undefined;
    page?: string | undefined;
    read?: boolean | undefined;
}>;
export type LoginRequest = z.infer<typeof LoginSchema>;
export type RegisterRequest = z.infer<typeof RegisterSchema>;
export type CreateOrgRequest = z.infer<typeof CreateOrgSchema>;
export type CreateProjectRequest = z.infer<typeof CreateProjectSchema>;
export type CreateTicketRequest = z.infer<typeof CreateTicketSchema>;
export type UpdateTicketRequest = z.infer<typeof UpdateTicketSchema>;
export type CreateCommentRequest = z.infer<typeof CreateCommentSchema>;
export type TicketFilters = z.infer<typeof TicketFilterSchema>;
//# sourceMappingURL=schemas.d.ts.map