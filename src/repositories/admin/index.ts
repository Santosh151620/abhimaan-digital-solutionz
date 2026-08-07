/**
 * ============================================================================
 * ADS Admin Repository Registry
 * Production Export Surface
 * ============================================================================
 */


export * from "./AdminRepository";


/*
 * Audit
 */
export * from "./AuditRepository";
export * from "./AuditLogsRepository";
export * from "./SupabaseAuditRepository";



/*
 * Organization Structure
 */
export * from "./OrganizationsRepository";
export * from "./BranchesRepository";
export * from "./DepartmentsRepository";
export * from "./DesignationsRepository";
export * from "./TeamsRepository";



/*
 * Identity & Access Management
 */
export * from "./UsersRepository";
export * from "./RolesRepository";
export * from "./PermissionsRepository";
export * from "./RolePermissionRepository";
export * from "./UserRoleRepository";



/*
 * Platform Configuration
 */
export * from "./ModulesRepository";
export * from "./SettingsRepository";
export * from "./PoliciesRepository";



/*
 * Communication & Automation
 */
export * from "./AnnouncementsRepository";
export * from "./NotificationsRepository";
export * from "./WorkflowsRepository";



/*
 * Supabase Admin Infrastructure
 */
export * from "./SupabaseAdminRepository";