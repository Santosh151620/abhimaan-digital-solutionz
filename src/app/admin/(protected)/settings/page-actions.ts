"use server";


import type {
    PlatformSetting,
    SettingCategory,
    SettingGroup,
} from "@/types/admin/Settings";


import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";


import {
    SettingsRepository,
} from "@/repositories/admin/SettingsRepository";



/**
 * ============================================================================
 * ADS ADMIN SETTINGS — SERVER ACTION BOUNDARY
 * ============================================================================
 *
 * Responsibilities:
 *
 * - Create a fresh authenticated Supabase server client per request.
 * - Delegate organization isolation to SettingsRepository/BaseRepository.
 * - Never accept organization_id from the caller as an authority.
 * - Validate all caller-controlled setting identifiers.
 * - Normalize setting keys consistently with repository semantics.
 * - Keep database persistence details inside the repository.
 * - Return domain models only.
 *
 * IMPORTANT:
 *
 * This file intentionally uses the ADMIN settings contract:
 *
 *     @/types/admin/Settings
 *
 * It is not a wrapper around the CRM Settings domain.
 *
 * The Admin settings repository remains the persistence owner for:
 *
 *     organization_settings
 *
 * ============================================================================
 */



/* ============================================================================
 * CONSTANTS
 * ========================================================================== */

const SETTING_KEY_PATTERN =
    /^[a-zA-Z0-9._:-]+$/;


const SETTING_KEY_MAX_LENGTH =
    255;


const SETTING_NAME_MAX_LENGTH =
    255;



const SUPPORTED_CATEGORIES:
    readonly SettingCategory[] =
    [

        "General",

        "Security",

        "Authentication",

        "Branding",

        "Localization",

        "Notification",

        "Email",

        "Storage",

        "AI",

        "Integration",

        "Workflow",

        "CRM",

        "Reporting",

        "Billing",

        "System",

    ];



/* ============================================================================
 * REPOSITORY FACTORY
 * ========================================================================== */

/**
 * Creates a request-scoped Admin Settings repository.
 *
 * A fresh authenticated Supabase client is deliberately created for every
 * server-action invocation.
 */
async function repository():
    Promise<SettingsRepository> {

    const supabase =
        await createSupabaseServerClient();


    return new SettingsRepository(
        supabase,
    );

}



/* ============================================================================
 * PUBLIC READ ACTIONS
 * ========================================================================== */

/**
 * Return all organization-scoped platform settings.
 *
 * Tenant identity is resolved by the repository/base repository and is never
 * accepted from the client.
 */
export async function getSettings():
    Promise<PlatformSetting[]> {

    const repo =
        await repository();


    return repo.list();

}



/**
 * Return all settings belonging to one supported category.
 */
export async function getSettingsByCategory(
    category: SettingCategory,
):
    Promise<SettingGroup> {

    const normalizedCategory =
        validateCategory(
            category,
        );


    const repo =
        await repository();


    return repo.findByCategory(
        normalizedCategory,
    );

}



/**
 * Find one organization-scoped setting by key.
 */
export async function getSettingByKey(
    key: string,
):
    Promise<PlatformSetting | null> {

    const normalizedKey =
        validateKey(
            key,
        );


    const repo =
        await repository();


    return repo.findByKey(
        normalizedKey,
    );

}



/**
 * Find one organization-scoped setting by category and key.
 */
export async function getSetting(
    category: SettingCategory,
    key: string,
):
    Promise<PlatformSetting | null> {

    const normalizedCategory =
        validateCategory(
            category,
        );


    const normalizedKey =
        validateKey(
            key,
        );


    const repo =
        await repository();


    return repo.find(
        normalizedCategory,
        normalizedKey,
    );

}



/* ============================================================================
 * PUBLIC WRITE ACTION
 * ========================================================================== */

/**
 * Create or update an organization-scoped platform setting.
 *
 * The supplied organizationId is deliberately removed from the persistence
 * authority. The repository determines the current organization from the
 * authenticated request context.
 */
export async function saveSetting(
    setting: PlatformSetting,
):
    Promise<void> {

    const normalizedSetting =
        validateSetting(
            setting,
        );


    const repo =
        await repository();


    await repo.save(
        normalizedSetting,
    );

}



/* ============================================================================
 * VALIDATION
 * ========================================================================== */

/**
 * Validate the complete Admin PlatformSetting contract before persistence.
 */
function validateSetting(
    setting: PlatformSetting,
):
    PlatformSetting {

    if (!setting) {

        throw new Error(
            "Setting is required.",
        );

    }


    const category =
        validateCategory(
            setting.category,
        );


    const key =
        validateKey(
            setting.key,
        );


    const name =
        typeof setting.name === "string"
            ? setting.name.trim()
            : "";


    if (!name) {

        throw new Error(
            "Setting name is required.",
        );

    }


    if (
        name.length >
        SETTING_NAME_MAX_LENGTH
    ) {

        throw new Error(
            `Setting name must not exceed ${SETTING_NAME_MAX_LENGTH} characters.`,
        );

    }


    if (!setting.scope) {

        throw new Error(
            "Setting scope is required.",
        );

    }


    if (
        setting.scope !== "Platform" &&
        setting.scope !== "Organization" &&
        setting.scope !== "Module" &&
        setting.scope !== "User"
    ) {

        throw new Error(
            "Invalid setting scope.",
        );

    }


    if (!setting.valueType) {

        throw new Error(
            "Setting value type is required.",
        );

    }


    if (
        setting.valueType !== "String" &&
        setting.valueType !== "Number" &&
        setting.valueType !== "Boolean" &&
        setting.valueType !== "Json" &&
        setting.valueType !== "Array"
    ) {

        throw new Error(
            "Invalid setting value type.",
        );

    }


    return {

        ...setting,

        category,

        key,

        name,

    };

}



/**
 * Validate and normalize a setting category.
 */
function validateCategory(
    category: SettingCategory,
):
    SettingCategory {

    if (
        typeof category !== "string"
    ) {

        throw new Error(
            "Setting category is required.",
        );

    }


    const normalized =
        category.trim();


    if (!normalized) {

        throw new Error(
            "Setting category is required.",
        );

    }


    if (
        !SUPPORTED_CATEGORIES.includes(
            normalized as SettingCategory,
        )
    ) {

        throw new Error(
            `Unsupported setting category: ${normalized}`,
        );

    }


    return normalized as SettingCategory;

}



/**
 * Validate and normalize a setting key.
 *
 * Keys are stored in normalized lowercase form so these values cannot become
 * logically separate settings:
 *
 *     Theme.Policy
 *     theme.policy
 */
function validateKey(
    key: string,
):
    string {

    if (
        typeof key !== "string"
    ) {

        throw new Error(
            "Setting key is required.",
        );

    }


    const normalized =
        key.trim().toLowerCase();


    if (!normalized) {

        throw new Error(
            "Setting key is required.",
        );

    }


    if (
        normalized.length >
        SETTING_KEY_MAX_LENGTH
    ) {

        throw new Error(
            `Setting key must not exceed ${SETTING_KEY_MAX_LENGTH} characters.`,
        );

    }


    if (
        !SETTING_KEY_PATTERN.test(
            normalized,
        )
    ) {

        throw new Error(
            "Setting key may contain only letters, numbers, dots, underscores, colons, and hyphens.",
        );

    }


    return normalized;

}
