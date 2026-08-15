"use server";

import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";

import {
    SettingsRepository,
} from "@/repositories/crm/SettingsRepository";

import {
    PermissionServiceInstance,
} from "@/services/crm/PermissionService";

import {
    CRM_ADMIN_ROLE,
} from "@/services/crm/crmPermissions";

import type {
    Setting,
    SettingStatus,
} from "@/types/crm/Settings";


type SettingAction =
    | "create"
    | "update"
    | "delete";


const SETTING_KEY_PATTERN =
    /^[a-zA-Z0-9._:-]+$/;

const SETTING_KEY_MAX_LENGTH =
    255;

const SETTING_NAME_MAX_LENGTH =
    150;

const VALID_STATUSES:
    readonly SettingStatus[] =
    [
        "Active",
        "Inactive",
    ];


/* ============================================================================
 * REPOSITORY
 * ========================================================================== */

async function repository():
    Promise<SettingsRepository> {

    const supabase =
        await createSupabaseServerClient();

    return new SettingsRepository(
        supabase,
    );

}


/* ============================================================================
 * VALIDATION
 * ========================================================================== */

function validateId(
    id: string,
): string {

    if (
        typeof id !== "string"
    ) {

        throw new Error(
            "Invalid setting id.",
        );

    }

    const normalized =
        id.trim();

    if (!normalized) {

        throw new Error(
            "Invalid setting id.",
        );

    }

    return normalized;

}


function validateData(
    data: Partial<Setting>,
    requireKey = false,
): void {

    if (
        !data ||
        typeof data !== "object"
    ) {

        throw new Error(
            "Setting data is required.",
        );

    }

    const key =
        typeof data.key === "string"
            ? data.key.trim().toLowerCase()
            : undefined;

    const name =
        typeof data.name === "string"
            ? data.name.trim()
            : undefined;


    if (
        (requireKey || data.key !== undefined) &&
        !key
    ) {

        throw new Error(
            "Setting key is required.",
        );

    }


    if (
        data.name !== undefined &&
        !name
    ) {

        throw new Error(
            "Setting name is required.",
        );

    }


    if (
        key &&
        !SETTING_KEY_PATTERN.test(key)
    ) {

        throw new Error(
            "Setting key may contain only letters, numbers, dots, underscores, colons, and hyphens.",
        );

    }


    if (
        key &&
        key.length >
        SETTING_KEY_MAX_LENGTH
    ) {

        throw new Error(
            `Setting key cannot exceed ${SETTING_KEY_MAX_LENGTH} characters.`,
        );

    }


    if (
        name &&
        name.length >
        SETTING_NAME_MAX_LENGTH
    ) {

        throw new Error(
            `Setting name cannot exceed ${SETTING_NAME_MAX_LENGTH} characters.`,
        );

    }


    if (
        data.status !== undefined &&
        !VALID_STATUSES.includes(
            data.status,
        )
    ) {

        throw new Error(
            "Invalid setting status.",
        );

    }

}


function normalizeData(
    data: Partial<Setting>,
):
    Partial<Setting> {

    const normalized = {
        ...data,
    };


    if (
        typeof data.key === "string"
    ) {

        normalized.key =
            data.key
                .trim()
                .toLowerCase();

    }


    if (
        typeof data.name === "string"
    ) {

        normalized.name =
            data.name.trim();

    }


    if (
        typeof data.description === "string"
    ) {

        normalized.description =
            data.description.trim();

    }


    return normalized;

}


function validateStatus(
    status: SettingStatus,
): void {

    if (
        !VALID_STATUSES.includes(status)
    ) {

        throw new Error(
            "Invalid setting status.",
        );

    }

}


/* ============================================================================
 * AUTHORIZATION
 * ========================================================================== */

function requirePermission(
    action: SettingAction,
): void {

    if (
        !PermissionServiceInstance.hasPermission(
            CRM_ADMIN_ROLE,
            "Settings",
            action,
        )
    ) {

        throw new Error(
            "Permission denied.",
        );

    }

}


/* ============================================================================
 * ERROR BOUNDARY
 * ========================================================================== */

function translateError(
    error: unknown,
): Error {

    if (
        error instanceof Error
    ) {

        const message =
            error.message;

        const normalized =
            message.toLowerCase();

        if (
            normalized.includes("duplicate") ||
            normalized.includes("unique") ||
            normalized.includes("already exists") ||
            normalized.includes("23505")
        ) {

            return new Error(
                "A setting with this key already exists.",
            );

        }

        return error;

    }

    return new Error(
        "Unable to process setting request.",
    );

}


async function execute<T>(
    operation: () => Promise<T>,
):
    Promise<T> {

    try {

        return await operation();

    } catch (error) {

        throw translateError(
            error,
        );

    }

}


/* ============================================================================
 * READ OPERATIONS
 * ========================================================================== */

export async function getSettings():
    Promise<Setting[]> {

    const repo =
        await repository();

    return repo.list();

}


export async function getArchivedSettings():
    Promise<Setting[]> {

    const repo =
        await repository();

    return repo.listArchived();

}


export async function getSetting(
    id: string,
):
    Promise<Setting | null> {

    const normalizedId =
        validateId(id);

    const repo =
        await repository();

    return repo.details(
        normalizedId,
    );

}


export async function getSettingsSummary():
    Promise<{
        total: number;
        active: number;
        inactive: number;
        editable: number;
        encrypted: number;
    }> {

    const repo =
        await repository();

    return repo.summary();

}


/* ============================================================================
 * CREATE
 * ========================================================================== */

export async function createSetting(
    data: Partial<Setting>,
):
    Promise<Setting> {

    requirePermission(
        "create",
    );

    validateData(
        data,
        true,
    );

    const normalizedData =
        normalizeData(data);

    return execute(
        async () => {

            const repo =
                await repository();

            return repo.create(
                normalizedData,
            );

        },
    );

}


/* ============================================================================
 * UPDATE
 * ========================================================================== */

export async function updateSetting(
    id: string,
    data: Partial<Setting>,
):
    Promise<Setting> {

    requirePermission(
        "update",
    );

    const normalizedId =
        validateId(id);

    validateData(data);

    const normalizedData =
        normalizeData(data);

    return execute(
        async () => {

            const repo =
                await repository();

            return repo.update(
                normalizedId,
                normalizedData,
            );

        },
    );

}


/* ============================================================================
 * DELETE
 * ========================================================================== */

export async function deleteSetting(
    id: string,
):
    Promise<void> {

    requirePermission(
        "delete",
    );

    const normalizedId =
        validateId(id);

    return execute(
        async () => {

            const repo =
                await repository();

            await repo.delete(
                normalizedId,
            );

        },
    );

}


/* ============================================================================
 * RESTORE
 * ========================================================================== */

export async function restoreSetting(
    id: string,
):
    Promise<boolean> {

    requirePermission(
        "update",
    );

    const normalizedId =
        validateId(id);

    return execute(
        async () => {

            const repo =
                await repository();

            return repo.restore(
                normalizedId,
            );

        },
    );

}


/* ============================================================================
 * STATUS
 * ========================================================================== */

export async function updateSettingStatus(
    id: string,
    status: SettingStatus,
):
    Promise<Setting> {

    requirePermission(
        "update",
    );

    const normalizedId =
        validateId(id);

    validateStatus(
        status,
    );

    return execute(
        async () => {

            const repo =
                await repository();

            return repo.updateStatus(
                normalizedId,
                status,
            );

        },
    );

}
