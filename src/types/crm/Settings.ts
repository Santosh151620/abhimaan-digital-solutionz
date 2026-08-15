/**
 * ============================================================================
 * ADS CRM — SETTINGS DOMAIN CONTRACT
 * ============================================================================
 *
 * Canonical CRM settings domain contract.
 *
 * IMPORTANT:
 * - This file defines application/domain contracts.
 * - It does NOT imply that every Setting property is a database column.
 * - Persistence is owned by SettingsRepository and the existing
 *   organization_settings table.
 * - Database-specific fields remain isolated in OrganizationSettingRow.
 * - PlatformSetting remains structurally compatible with Setting.
 * ============================================================================
 */


/* ============================================================================
 * SETTING ENUMS / VALUE CONTRACTS
 * ========================================================================== */

export type SettingCategory =
    | "General"
    | "System"
    | "Company"
    | "User"
    | "Notification"
    | "Notifications"
    | "Integration"
    | "Integrations"
    | "Security"
    | "Appearance"
    | "Other"
    | "CRM"
    | "Sales"
    | "Workflow"
    | "Email"
    | "Localization"
    | "Authentication"
    | "Branding"
    | "Storage"
    | "AI"
    | "Reporting"
    | "Billing";


export type SettingValueType =
    | "String"
    | "Number"
    | "Boolean"
    | "Array"
    | "Json";


export type SettingValue =
    | string
    | number
    | boolean
    | Record<string, unknown>
    | unknown[]
    | null;


export type SettingStatus =
    | "Active"
    | "Inactive"
    | "Archived"
    | "Draft";


/* ============================================================================
 * SETTING DOMAIN MODEL
 * ========================================================================== */

export interface Setting {

    id:
        string;

    organizationId:
        string;

    /**
     * Kept compatible with both CRM and Admin settings terminology.
     */
    entityType:
        | "Setting"
        | "PlatformSetting";

    scope:
        | "Organization"
        | "User"
        | "System";

    category:
        SettingCategory;

    key:
        string;

    name:
        string;

    description?:
        string;

    value:
        SettingValue;

    valueType:
        SettingValueType;

    isSystem:
        boolean;

    isReadonly:
        boolean;

    isEncrypted:
        boolean;

    isVisible:
        boolean;

    isActive:
        boolean;

    metadata:
        Record<string, unknown>;

    createdAt:
        string;

    updatedAt:
        string;


    /* ------------------------------------------------------------------------
     * Legacy CRM compatibility fields
     * ---------------------------------------------------------------------- */

    /**
     * Legacy UI identifier.
     */
    settingNumber?:
        string;

    /**
     * Indicates whether the setting can be edited.
     *
     * New code should generally derive editability from isReadonly.
     */
    editable?:
        boolean;

    /**
     * Legacy status representation.
     */
    status?:
        SettingStatus;

    /**
     * Legacy alias for isEncrypted.
     *
     * New code should prefer isEncrypted.
     */
    encrypted?:
        boolean;

}


/* ============================================================================
 * ADMIN / PLATFORM COMPATIBILITY
 * ========================================================================== */

/**
 * PlatformSetting is intentionally structurally identical to Setting.
 *
 * This allows the Admin settings UI and CRM settings UI to share the same
 * domain contract without introducing duplicate models.
 */
export type PlatformSetting =
    Setting;


/* ============================================================================
 * CRM SETTINGS SUMMARY
 * ========================================================================== */

/**
 * Canonical aggregate consumed by the CRM settings page and summary UI.
 *
 * This is a derived application model.
 * It does NOT represent a database table.
 */
export interface SettingsSummary {

    /**
     * Total number of settings.
     */
    total:
        number;

    /**
     * Number of active settings.
     */
    active:
        number;

    /**
     * Number of inactive settings.
     */
    inactive:
        number;

    /**
     * Number of settings that are not readonly.
     */
    editable:
        number;

    /**
     * Number of system settings.
     */
    system:
        number;

    /**
     * Number of encrypted settings.
     */
    encrypted:
        number;

    /**
     * Number of distinct setting categories represented.
     */
    categories:
        number;

}


/**
 * Compatibility alias retained for existing callers.
 */
export type SettingSummary =
    SettingsSummary;


/* ============================================================================
 * DATABASE PERSISTENCE MODEL
 * ========================================================================== */

/**
 * Persistence contract for the existing organization_settings table.
 *
 * Keep database naming isolated from the application/domain model.
 */
export interface OrganizationSettingRow {

    id:
        string;

    organization_id:
        string;

    setting_key:
        string;

    setting_value:
        unknown;

    category:
        string | null;

    description:
        string | null;

    metadata?:
        Record<string, unknown> | null;

    created_at:
        string | null;

    updated_at:
        string | null;

}


/* ============================================================================
 * INPUT CONTRACT
 * ========================================================================== */

/**
 * Generic create/update input.
 *
 * Repository/service validation remains responsible for determining which
 * fields are actually persisted and which are domain-only compatibility
 * fields.
 */
export type SettingInput =
    Partial<Setting>;
