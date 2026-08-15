import type {
    Role,
} from "@/types/auth/role";


/**
 * ============================================================================
 * ADS ROLE GOVERNANCE
 * ============================================================================
 *
 * Canonical descriptive governance metadata for application roles.
 *
 * Responsibilities:
 *
 * - Define the business meaning of every supported Role.
 * - Provide stable descriptive metadata for Admin / authorization UI.
 * - Preserve legacy roles required for backward compatibility.
 *
 * IMPORTANT:
 *
 * This module does NOT grant permissions.
 *
 * Permission authority remains in the permission/authorization layer.
 * Role governance describes responsibility and hierarchy only.
 *
 * Do not add database access, Supabase calls, tenant resolution, or request
 * authorization logic here.
 * ============================================================================
 */


export interface RoleGovernance {

    readonly role: Role;

    readonly description: string;

    readonly responsibilities:
        readonly string[];

}


/**
 * ============================================================================
 * CANONICAL ROLE GOVERNANCE
 * ============================================================================
 *
 * Primary ADS governance hierarchy:
 *
 * PLATFORM_OWNER
 *     ↓
 * PLATFORM_ADMIN
 *     ↓
 * ORGANIZATION_ADMIN
 *     ↓
 * DEPARTMENT_ADMIN
 *     ↓
 * TEAM_LEAD
 *     ↓
 * USER
 *
 * VIEWER is a read-only compatibility/business role.
 *
 * SUPER_ADMIN, ADMIN and MANAGER are retained as legacy compatibility roles.
 * They must not be removed until all persisted role assignments and dependent
 * application flows have been migrated.
 * ============================================================================
 */


export const ROLE_GOVERNANCE:
    Readonly<Record<Role, RoleGovernance>> = {

    PLATFORM_OWNER: {

        role:
            "PLATFORM_OWNER",

        description:
            "Ultimate platform authority",

        responsibilities: [

            "Manage platform configuration",

            "Manage organizations",

            "Manage platform administrators",

            "View global audit",

        ],

    },


    PLATFORM_ADMIN: {

        role:
            "PLATFORM_ADMIN",

        description:
            "Platform operations administrator",

        responsibilities: [

            "Manage platform settings",

            "Support organizations",

            "Manage system permissions",

        ],

    },


    ORGANIZATION_ADMIN: {

        role:
            "ORGANIZATION_ADMIN",

        description:
            "Organization administrator",

        responsibilities: [

            "Manage organization users",

            "Configure organization settings",

            "Manage CRM operations",

        ],

    },


    DEPARTMENT_ADMIN: {

        role:
            "DEPARTMENT_ADMIN",

        description:
            "Department administrator",

        responsibilities: [

            "Manage department users",

            "Manage department workflows",

        ],

    },


    TEAM_LEAD: {

        role:
            "TEAM_LEAD",

        description:
            "Team supervisor",

        responsibilities: [

            "Manage team activities",

            "Review team performance",

        ],

    },


    USER: {

        role:
            "USER",

        description:
            "Standard business user",

        responsibilities: [

            "Execute assigned business activities",

        ],

    },


    VIEWER: {

        role:
            "VIEWER",

        description:
            "Read-only user",

        responsibilities: [

            "View permitted information",

        ],

    },


    /**
     * Legacy compatibility role.
     *
     * Retained so existing persisted assignments do not break while the
     * platform governance model is migrated to the canonical hierarchy.
     */
    SUPER_ADMIN: {

        role:
            "SUPER_ADMIN",

        description:
            "Legacy platform super administrator",

        responsibilities: [

            "Compatibility role",

            "Full administrative access",

        ],

    },


    /**
     * Legacy compatibility role.
     */
    ADMIN: {

        role:
            "ADMIN",

        description:
            "Legacy administrator role",

        responsibilities: [

            "Compatibility role",

            "Administrative operations",

        ],

    },


    /**
     * Legacy compatibility role.
     */
    MANAGER: {

        role:
            "MANAGER",

        description:
            "Legacy manager role",

        responsibilities: [

            "Compatibility role",

            "Team management",

        ],

    },

};


/**
 * ============================================================================
 * ROLE GOVERNANCE HELPERS
 * ============================================================================
 */


/**
 * Return governance metadata for a role.
 */
export function getRoleGovernance(
    role: Role,
): RoleGovernance {

    return ROLE_GOVERNANCE[role];

}


/**
 * Return the human-readable description for a role.
 */
export function getRoleDescription(
    role: Role,
): string {

    return ROLE_GOVERNANCE[role].description;

}


/**
 * Return an immutable responsibility list for a role.
 */
export function getRoleResponsibilities(
    role: Role,
): readonly string[] {

    return ROLE_GOVERNANCE[role].responsibilities;

}


/**
 * Return all supported role governance definitions.
 *
 * The returned array is derived from the canonical map so there is only one
 * source of truth for role metadata.
 */
export function listRoleGovernance():
    readonly RoleGovernance[] {

    return Object.values(
        ROLE_GOVERNANCE,
    );

}


/**
 * Return whether governance metadata exists for the supplied role.
 *
 * Useful at compatibility boundaries where a role may originate from an
 * external/persisted string before it is narrowed to the Role type.
 */
export function hasRoleGovernance(
    role: string,
): role is Role {

    return Object.prototype.hasOwnProperty.call(
        ROLE_GOVERNANCE,
        role,
    );

}