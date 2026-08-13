"use server";

import {
    revalidatePath,
} from "next/cache";

import {
    createClient,
} from "@/lib/supabase/server";

import {
    RolesRepository,
} from "@/repositories/admin/RolesRepository";

import {
    RolesService,
} from "@/services/admin/RolesService";

import type {
    Role,
} from "@/types/admin/Role";


/**
 * ============================================================================
 * Roles Administration Actions
 * ============================================================================
 *
 * Server-only application boundary for role administration.
 *
 * Responsibilities:
 *
 * - Validate incoming server-action input.
 * - Normalize role names/codes.
 * - Delegate role lifecycle operations to RolesService.
 * - Protect system roles.
 * - Manage role-permission assignments.
 * - Revalidate affected Admin routes.
 *
 * Tenant / organization ownership remains inside the repository/service
 * boundary. Callers never supply a persisted organizationId directly.
 *
 * ============================================================================
 */


async function getService(): Promise<RolesService> {

    const repository =
        new RolesRepository();

    return new RolesService(
        repository,
    );

}


/**
 * ============================================================================
 * Validation Helpers
 * ============================================================================
 */


function requireText(
    value: string | undefined,
    message: string,
): string {

    const normalized =
        value?.trim();

    if (!normalized) {

        throw new Error(
            message,
        );

    }

    return normalized;

}


function validateId(
    id: string,
    message = "Role ID is required.",
): string {

    return requireText(
        id,
        message,
    );

}


function normalizeRoleCode(
    code: string | undefined,
): string {

    const normalized =
        requireText(
            code,
            "Role code is required.",
        )
            .toLowerCase();

    if (
        !/^[a-z0-9_-]+$/.test(
            normalized,
        )
    ) {

        throw new Error(
            "Role code may contain only lowercase letters, numbers, underscores, and hyphens.",
        );

    }

    return normalized;

}


function normalizePermissionIds(
    permissionIds:
        | string[]
        | undefined,
): string[] {

    return Array.from(
        new Set(
            (permissionIds ?? [])
                .filter(
                    (
                        permissionId,
                    ): permissionId is string =>
                        typeof permissionId === "string" &&
                        Boolean(
                            permissionId.trim(),
                        ),
                )
                .map(
                    permissionId =>
                        permissionId.trim(),
                ),
        ),
    );

}


function validateRoleInput(
    data: Partial<Role>,
): void {

    if (!data) {

        throw new Error(
            "Role is required.",
        );

    }

    requireText(
        data.name,
        "Role name is required.",
    );

    normalizeRoleCode(
        data.code,
    );

    if (!data.type) {

        throw new Error(
            "Role type is required.",
        );

    }

    if (!data.level) {

        throw new Error(
            "Role level is required.",
        );

    }

    if (!data.status) {

        throw new Error(
            "Role status is required.",
        );

    }

}


/**
 * System roles are platform-controlled.
 *
 * They must never be changed through the normal organization role
 * administration workflow.
 */
function protectSystemRole(
    role: Role,
): void {

    if (role.isSystem) {

        throw new Error(
            "System roles cannot be modified.",
        );

    }

}


/**
 * ============================================================================
 * Create Role
 * ============================================================================
 */


export async function createRole(
    data: Partial<Role>,
) {

    validateRoleInput(
        data,
    );

    const service =
        await getService();

    const now =
        new Date()
            .toISOString();

    const role: Role = {

        id:
            crypto.randomUUID(),

        organizationId:
            undefined,

        name:
            requireText(
                data.name,
                "Role name is required.",
            ),

        code:
            normalizeRoleCode(
                data.code,
            ),

        description:
            data.description?.trim()
            || undefined,

        type:
            data.type ?? "Custom",

        level:
            data.level ?? "Organization",

        status:
            data.status ?? "Active",

        permissionIds:
            normalizePermissionIds(
                data.permissionIds,
            ),

        isSystem:
            false,

        isDefault:
            data.isDefault ?? false,

        isActive:
            (data.status ?? "Active")
            === "Active",

        metadata:
            data.metadata ?? {},

        createdAt:
            now,

        updatedAt:
            now,

    };

    await service.save(
        role,
    );

    revalidateRoleRoutes();

    return {
        success: true,
        id: role.id,
    };

}


/**
 * ============================================================================
 * Update Role
 * ============================================================================
 */


export async function updateRole(
    role: Role,
) {

    if (!role) {

        throw new Error(
            "Role is required.",
        );

    }

    validateId(
        role.id,
    );

    protectSystemRole(
        role,
    );

    validateRoleInput(
        role,
    );

    const service =
        await getService();

    const now =
        new Date()
            .toISOString();

    await service.save({

        ...role,

        organizationId:
            undefined,

        name:
            requireText(
                role.name,
                "Role name is required.",
            ),

        code:
            normalizeRoleCode(
                role.code,
            ),

        description:
            role.description?.trim()
            || undefined,

        permissionIds:
            normalizePermissionIds(
                role.permissionIds,
            ),

        isSystem:
            false,

        isActive:
            role.status === "Active",

        updatedAt:
            now,

    });

    revalidateRoleRoutes();

    return {
        success: true,
    };

}


/**
 * ============================================================================
 * Delete Role
 * ============================================================================
 *
 * System-role protection is enforced again at the service/repository boundary.
 * The server action therefore does not rely solely on the client hiding the
 * Delete button.
 *
 * ============================================================================
 */


export async function deleteRole(
    id: string,
) {

    const normalizedId =
        validateId(
            id,
        );

    const service =
        await getService();

    const existing =
        await service.findById(
            normalizedId,
        );

    if (!existing) {

        throw new Error(
            "Role not found.",
        );

    }

    protectSystemRole(
        existing,
    );

    await service.delete(
        normalizedId,
    );

    revalidateRoleRoutes();

    return {
        success: true,
    };

}


/**
 * ============================================================================
 * Role Permission Validation
 * ============================================================================
 */


function validatePermissionMapping(
    roleId: string,
    permissionId: string,
): {
    roleId: string;
    permissionId: string;
} {

    return {

        roleId:
            validateId(
                roleId,
                "Role ID is required.",
            ),

        permissionId:
            requireText(
                permissionId,
                "Permission ID is required.",
            ),

    };

}


/**
 * ============================================================================
 * Role Permission Protection
 * ============================================================================
 */


async function requireMutableRole(
    roleId: string,
) {

    const supabase =
        await createClient();

    const {
        data: role,
        error,
    } =
        await supabase
            .from("roles")
            .select(
                "id,is_system",
            )
            .eq(
                "id",
                roleId,
            )
            .maybeSingle();

    if (error) {

        throw error;

    }

    if (!role) {

        throw new Error(
            "Role not found.",
        );

    }

    if (role.is_system === true) {

        throw new Error(
            "System role permissions cannot be modified.",
        );

    }

    return supabase;

}


/**
 * ============================================================================
 * Assign Role Permission
 * ============================================================================
 */


export async function assignRolePermission(
    roleId: string,
    permissionId: string,
) {

    const normalized =
        validatePermissionMapping(
            roleId,
            permissionId,
        );

    const supabase =
        await requireMutableRole(
            normalized.roleId,
        );

    const {
        error,
    } =
        await supabase
            .from("role_permissions")
            .upsert(
                {

                    id:
                        crypto.randomUUID(),

                    role_id:
                        normalized.roleId,

                    permission_id:
                        normalized.permissionId,

                    created_at:
                        new Date()
                            .toISOString(),

                },
                {
                    onConflict:
                        "role_id,permission_id",
                },
            );

    if (error) {

        throw error;

    }

    revalidateRoleRoutes();

    return {
        success: true,
    };

}


/**
 * ============================================================================
 * Revoke Role Permission
 * ============================================================================
 */


export async function revokeRolePermission(
    roleId: string,
    permissionId: string,
) {

    const normalized =
        validatePermissionMapping(
            roleId,
            permissionId,
        );

    const supabase =
        await requireMutableRole(
            normalized.roleId,
        );

    const {
        error,
    } =
        await supabase
            .from("role_permissions")
            .delete()
            .eq(
                "role_id",
                normalized.roleId,
            )
            .eq(
                "permission_id",
                normalized.permissionId,
            );

    if (error) {

        throw error;

    }

    revalidateRoleRoutes();

    return {
        success: true,
    };

}


/**
 * ============================================================================
 * Route Revalidation
 * ============================================================================
 */


function revalidateRoleRoutes(): void {

    revalidatePath(
        "/admin/roles",
    );

    revalidatePath(
        "/admin/role-permissions",
    );

}