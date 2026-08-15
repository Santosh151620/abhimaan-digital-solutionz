/**
 * ============================================================================
 * ADS ADMIN PERMISSIONS
 * ============================================================================
 *
 * Canonical permission vocabulary for the Admin module.
 *
 * IMPORTANT:
 *
 * - Permission keys are application contracts.
 * - Do not rename existing keys without a migration of all consumers.
 * - Do not add permissions here merely to satisfy a UI check.
 * - Authorization enforcement must occur server-side.
 * - Database/RLS enforcement remains authoritative for tenant data access.
 * ============================================================================
 */

export const ADMIN_PERMISSIONS = [
    "users.manage",

    "roles.manage",

    "permissions.manage",

    "settings.manage",

    "notifications.manage",

    "system.email.manage",

    "audit.manage",
] as const;


/**
 * Union of all supported Admin permission keys.
 */
export type AdminPermission =
    (typeof ADMIN_PERMISSIONS)[number];


/**
 * Runtime-safe Admin permission check.
 *
 * Centralizing membership checks prevents individual modules from
 * maintaining their own permission arrays or string comparisons.
 */
export function isAdminPermission(
    permission: string,
): permission is AdminPermission {

    return (
        ADMIN_PERMISSIONS as readonly string[]
    ).includes(
        permission,
    );

}
