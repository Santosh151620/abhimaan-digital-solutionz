/**
 * ============================================================================
 * ADS ROLE → PERMISSION MATRIX
 * ============================================================================
 *
 * Canonical mapping between application roles and their permitted
 * capabilities.
 *
 * This file defines the default permission envelope for each Role.
 *
 * IMPORTANT:
 *
 * This matrix does NOT replace:
 *
 * - server-side authorization
 * - organization membership checks
 * - tenant isolation
 * - Supabase RLS
 *
 * Permission identifiers remain owned by the canonical permission catalogues.
 * ============================================================================
 */

import type {
    Role,
} from "@/types/auth/role";


import type {
    Permission,
} from "@/shared/permissions";


import {
    PLATFORM_PERMISSIONS,
} from "./platform.permissions";


import {
    ADMIN_PERMISSIONS,
} from "./admin.permissions";


import {
    CRM_PERMISSIONS,
} from "./crm.permissions";



/**
 * ============================================================================
 * ROLE → PERMISSION MATRIX
 * ============================================================================
 */

export const ROLE_PERMISSIONS = {

    /**
     * Ultimate platform authority.
     */
    PLATFORM_OWNER: [

        ...PLATFORM_PERMISSIONS,

        ...ADMIN_PERMISSIONS,

        ...CRM_PERMISSIONS,

    ],


    /**
     * Platform operations authority.
     *
     * Platform and application administration without organization CRM
     * permissions by default.
     */
    PLATFORM_ADMIN: [

        ...PLATFORM_PERMISSIONS,

        ...ADMIN_PERMISSIONS,

    ],


    /**
     * Organization administrator.
     */
    ORGANIZATION_ADMIN: [

        ...ADMIN_PERMISSIONS,

        ...CRM_PERMISSIONS,

    ],


    /**
     * Department administrator.
     */
    DEPARTMENT_ADMIN: [

        ...CRM_PERMISSIONS,

    ],


    /**
     * Team supervisor.
     */
    TEAM_LEAD: [

        "leads.view",

        "companies.view",

        "contacts.view",

        "projects.view",

        "projects.update",

    ],


    /**
     * Standard business user.
     */
    USER: [

        "leads.view",

        "companies.view",

        "contacts.view",

        "projects.view",

    ],


    /**
     * Read-only business user.
     */
    VIEWER: [

        "leads.view",

        "companies.view",

        "contacts.view",

    ],


    /**
     * Legacy compatibility role.
     */
    SUPER_ADMIN: [

        ...CRM_PERMISSIONS,

        ...ADMIN_PERMISSIONS,

    ],


    /**
     * Legacy compatibility role.
     */
    ADMIN: [

        ...CRM_PERMISSIONS,

        ...ADMIN_PERMISSIONS,

    ],


    /**
     * Legacy compatibility role.
     */
    MANAGER: [

        "projects.view",

        "projects.update",

        "companies.view",

        "contacts.view",

    ],

} as const satisfies Record<
    Role,
    readonly Permission[]
>;



/**
 * Strongly typed role-permission matrix.
 */
export type RolePermissions =
    typeof ROLE_PERMISSIONS;



/**
 * Return the canonical permissions assigned to a role.
 *
 * The returned collection is readonly and must not be mutated.
 */
export function getRolePermissions(
    role: Role,
): readonly Permission[] {

    return ROLE_PERMISSIONS[role];

}



/**
 * Check whether a role has a specific permission.
 *
 * IMPORTANT:
 *
 * We intentionally use `some()` rather than `includes()`.
 *
 * TypeScript can infer `ROLE_PERMISSIONS[role]` as a union of different
 * readonly tuples. Calling `includes()` on that union causes its parameter
 * type to collapse to `never`.
 *
 * `some()` preserves the runtime behavior while allowing the permission
 * value to be compared against the canonical Permission union safely.
 */
export function roleHasPermission(
    role: Role,
    permission: Permission,
): boolean {

    return ROLE_PERMISSIONS[role].some(
        (
            assignedPermission,
        ) =>
            assignedPermission === permission,
    );

}