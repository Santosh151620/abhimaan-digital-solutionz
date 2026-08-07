export {
    getAuthContext,
    requireAuthContext,
} from "./auth-context.server";

export {
    getCurrentUser,
    requireUser,
} from "./user";

export {
    requireAuthenticated,
    requireOrganization,
    requireRole,
    requireMinimumRole,
    requireOwner,
    requireAdmin,
    requireManager,
    requireEmployee,
} from "./guards";

export {
    requirePermission,
} from "./permission-guard";

export {
    requireSecurityContext,
    requireRoleAccess,
    requirePlatformOwner,
    requirePlatformAdmin,
    requireOrganizationAdmin,
    requireDepartmentAdmin,
    requireTeamLead,
    requireAuthenticatedUser,
} from "./security";

export {
    ROLE_HIERARCHY,
} from "./role-hierarchy";

export {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
} from "./authorization";

export type {
    AuthContext,
} from "./auth-context.server";

export type {
    AuthUser,
} from "./user";

export type {
    Role,
} from "@/types/auth/role";

export type {
    Permission,
} from "@/shared/permissions";