/**
 * ============================================================================
 * ADS CRM — SETTINGS DOMAIN CONTRACT
 * ============================================================================
 *
 * Canonical CRM settings contract.
 *
 * IMPORTANT:
 * This is a domain/UI compatibility contract.
 * It does NOT mean every property is a database column.
 *
 * Persistence remains owned by SettingsRepository and the existing
 * organization_settings table.
 * ============================================================================
 */

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


export interface Setting {

    id: string;

    organizationId: string;

    /**
     * Kept broad because existing CRM repository/domain models use both
     * Setting and PlatformSetting terminology.
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


    /**
     * ------------------------------------------------------------------------
     * Legacy CRM Settings UI compatibility
     * ------------------------------------------------------------------------
     */

    settingNumber?:
        string;

    editable?:
        boolean;

    status?:
        SettingStatus;

    /**
     * Legacy alias retained for existing CRM screens.
     *
     * New code should prefer isEncrypted.
     */
    encrypted?:
        boolean;
}


/**
 * PlatformSetting is the name used by the newer admin/settings service
 * boundary. It intentionally remains structurally compatible with Setting.
 */
export type PlatformSetting =
    Setting;


/**
 * Summary model consumed by the CRM settings list/summary UI.
 *
 * Keep this lightweight and derived from settings; it does not represent
 * another database table.
 */
export interface SettingsSummary {

    total: number;

    active: number;

    inactive: number;

    system: number;

    encrypted: number;

    categories: number;

}

/**
 * Compatibility alias used by callers that describe the summary as a
 * collection rather than a single aggregate.
 */
export type SettingSummary =
    SettingsSummary;


/**
 * Persistence row for organization_settings.
 *
 * This is deliberately separate from Setting.
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


/**
 * Generic create/update payload.
 */
export type SettingInput =
    Partial<Setting>;