/**
 * ============================================================================
 * ADS PLATFORM PERMISSIONS
 * ============================================================================
 *
 * Canonical permission catalogue for platform-level administration.
 *
 * These permissions operate above the organization/CRM boundary and should
 * only be granted through the platform governance/RBAC layer.
 *
 * IMPORTANT:
 *
 * - Existing permission identifiers are preserved.
 * - Permission constants do not themselves grant authorization.
 * - Server-side authorization remains mandatory.
 * - Organization isolation and Supabase RLS remain authoritative for
 *   organization-scoped data.
 * ============================================================================
 */

export const PLATFORM_PERMISSIONS = [
    "platform.view",
    "platform.manage",

    "organization.create",
    "organization.delete",

    "billing.manage",

    "audit.view",
] as const;


/**
 * Strongly typed platform permission identifier.
 */
export type PlatformPermission =
    (typeof PLATFORM_PERMISSIONS)[number];


/**
 * Runtime-safe platform permission validation.
 *
 * Useful when permission values originate from persisted role assignments,
 * session state, API payloads, or other runtime sources.
 */
export function isPlatformPermission(
    permission: string,
): permission is PlatformPermission {

    return (
        PLATFORM_PERMISSIONS as readonly string[]
    ).includes(
        permission,
    );

}