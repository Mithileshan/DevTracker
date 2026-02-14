"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketPriority = exports.TicketStatus = exports.TicketType = exports.ProjectRole = exports.OrgRole = void 0;
// ============ Permission/RBAC ============
var OrgRole;
(function (OrgRole) {
    OrgRole["OWNER"] = "org_owner";
    OrgRole["ADMIN"] = "org_admin";
    OrgRole["MEMBER"] = "org_member";
})(OrgRole || (exports.OrgRole = OrgRole = {}));
var ProjectRole;
(function (ProjectRole) {
    ProjectRole["OWNER"] = "owner";
    ProjectRole["ADMIN"] = "admin";
    ProjectRole["DEVELOPER"] = "developer";
    ProjectRole["TESTER"] = "tester";
    ProjectRole["VIEWER"] = "viewer";
})(ProjectRole || (exports.ProjectRole = ProjectRole = {}));
// ============ Enum Types ============
var TicketType;
(function (TicketType) {
    TicketType["BUG"] = "bug";
    TicketType["TASK"] = "task";
    TicketType["FEATURE"] = "feature";
})(TicketType || (exports.TicketType = TicketType = {}));
var TicketStatus;
(function (TicketStatus) {
    TicketStatus["OPEN"] = "open";
    TicketStatus["IN_PROGRESS"] = "in_progress";
    TicketStatus["BLOCKED"] = "blocked";
    TicketStatus["DONE"] = "done";
})(TicketStatus || (exports.TicketStatus = TicketStatus = {}));
var TicketPriority;
(function (TicketPriority) {
    TicketPriority["LOW"] = "low";
    TicketPriority["MEDIUM"] = "medium";
    TicketPriority["HIGH"] = "high";
    TicketPriority["CRITICAL"] = "critical";
})(TicketPriority || (exports.TicketPriority = TicketPriority = {}));
//# sourceMappingURL=types.js.map