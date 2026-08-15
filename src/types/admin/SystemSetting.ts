/**
 * ============================================================================
 * ADS ENTERPRISE PLATFORM
 *
 * Platform Settings Contract
 *
 * Production Configuration Management
 * CRM + ERP Compatible
 * Multi-Tenant
 * SaaS / On-Prem Ready
 *
 * Architecture:
 *
 * Deployment Environment
 *        ↓
 * PlatformSetting
 *        ↓
 * Organization / Module / User configuration
 *
 * IMPORTANT:
 * - Secrets such as API keys must remain in environment/secret storage.
 * - This contract must not become a second settings domain.
 * - Persistence is handled by the settings repository.
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";



/**
 * ============================================================================
 * Setting Scope
 *
 * Determines where a setting applies.
 * ============================================================================
 */
export type SettingScope =
    | "Platform"
    | "Organization"
    | "Module"
    | "User";



/**
 * ============================================================================
 * Setting Category
 *
 * Standard platform configuration areas.
 * ============================================================================
 */
export type SettingCategory =
    | "General"
    | "Security"
    | "Authentication"
    | "Branding"
    | "Localization"
    | "Notification"
    | "Email"
    | "Storage"
    | "AI"
    | "Integration"
    | "Workflow"
    | "CRM"
    | "Reporting"
    | "Billing"
    | "System";



/**
 * ============================================================================
 * Setting Value Type
 *
 * Describes the runtime representation of the setting value.
 * ============================================================================
 */
export type SettingValueType =
    | "String"
    | "Number"
    | "Boolean"
    | "Json"
    | "Array";



/**
 * ============================================================================
 * Platform Setting
 *
 * Canonical ADS configuration contract.
 *
 * This is the single application-level settings model.
 *
 * Do NOT introduce SystemSetting, UserSetting, ThemeSetting,
 * OrganizationSetting, or ModuleSetting as separate persistence domains.
 * ============================================================================
 */
export interface PlatformSetting
    extends BaseEntity {


    /**
     * =========================================================================
     * Tenant Ownership
     *
     * Undefined means platform-level configuration.
     *
     * Organization-level settings must contain organizationId.
     * =========================================================================
     */
    organizationId?: string;



    /**
     * =========================================================================
     * Configuration Scope
     * =========================================================================
     */
    scope: SettingScope;



    /**
     * =========================================================================
     * Configuration Classification
     * =========================================================================
     */
    category: SettingCategory;



    /**
     * =========================================================================
     * Stable Configuration Key
     *
     * Example:
     *
     * theme_policy
     * user_theme:<user-id>
     * default_currency
     * =========================================================================
     */
    key: string;



    /**
     * =========================================================================
     * Display Identity
     * =========================================================================
     */
    name: string;



    /**
     * =========================================================================
     * Human-readable description
     * =========================================================================
     */
    description?: string;



    /**
     * =========================================================================
     * Current Value
     * =========================================================================
     *
     * Runtime value after persistence/resolution.
     */
    value:
        | string
        | number
        | boolean
        | Record<string, unknown>
        | unknown[];



    /**
     * =========================================================================
     * Value Type
     * =========================================================================
     */
    valueType: SettingValueType;



    /**
     * =========================================================================
     * Default Value
     * =========================================================================
     *
     * Used when an explicit value has not been configured.
     */
    defaultValue?:
        | string
        | number
        | boolean
        | Record<string, unknown>
        | unknown[];



    /**
     * =========================================================================
     * Governance
     * =========================================================================
     *
     * System settings may be protected from deletion/modification.
     */
    isSystem: boolean;



    /**
     * Prevent modification through normal administration APIs.
     */
    isReadonly: boolean;



    /**
     * =========================================================================
     * Security
     * =========================================================================
     *
     * Indicates that the persisted value is sensitive.
     *
     * Actual encryption/secrets management remains the responsibility
     * of the persistence/infrastructure layer.
     */
    isEncrypted: boolean;



    /**
     * =========================================================================
     * Visibility
     * =========================================================================
     *
     * Controls whether the setting may be exposed to administrative UI.
     *
     * This does NOT override authorization or secret protection.
     */
    isVisible: boolean;



    /**
     * =========================================================================
     * Lifecycle
     * =========================================================================
     */
    isActive: boolean;



    /**
     * =========================================================================
     * Optional Validation
     * =========================================================================
     *
     * Validation expression interpreted by SettingsService.
     */
    validationExpression?: string;



    /**
     * =========================================================================
     * Allowed Values
     * =========================================================================
     *
     * Useful for controlled configuration such as:
     *
     * themes
     * locales
     * currencies
     * notification modes
     */
    allowedValues?: unknown[];



    /**
     * =========================================================================
     * Audit
     * =========================================================================
     */
    createdBy?: string;

    updatedBy?: string;



    /**
     * =========================================================================
     * Extension Metadata
     * =========================================================================
     */
    metadata?: Record<string, unknown>;

}



/**
 * ============================================================================
 * Setting Group
 *
 * Administrative/UI grouping of settings.
 * ============================================================================
 */
export interface SettingGroup {

    category: SettingCategory;

    settings: PlatformSetting[];

}



/**
 * ============================================================================
 * Organization Settings
 *
 * Convenience read model for organization-scoped configuration.
 *
 * This does NOT imply a separate database table.
 * ============================================================================
 */
export interface OrganizationSettings {

    organizationId: string;

    settings: PlatformSetting[];

}



/**
 * ============================================================================
 * Setting Resolution Context
 *
 * Used by SettingsService when resolving effective configuration.
 * ============================================================================
 */
export interface SettingResolutionContext {

    organizationId?: string;

    moduleCode?: string;

    userId?: string;

}



/**
 * ============================================================================
 * Resolved Setting
 *
 * Represents the effective setting after applying scope precedence.
 *
 * Suggested precedence:
 *
 * User
 *   ↓
 * Module
 *   ↓
 * Organization
 *   ↓
 * Platform
 *   ↓
 * Default
 * ============================================================================
 */
export interface ResolvedSetting<T =
    | string
    | number
    | boolean
    | Record<string, unknown>
    | unknown[]> {

    key: string;

    category: SettingCategory;

    scope: SettingScope;

    value: T;

    source:
        | "User"
        | "Module"
        | "Organization"
        | "Platform"
        | "Default";

    settingId?: string;

}



/**
 * ============================================================================
 * Setting Mutation Input
 *
 * Used by service/application layers.
 *
 * Database-specific fields must remain outside this contract.
 * ============================================================================
 */
export interface SettingMutationInput {

    organizationId?: string;

    scope: SettingScope;

    category: SettingCategory;

    key: string;

    name?: string;

    description?: string;

    value:
        | string
        | number
        | boolean
        | Record<string, unknown>
        | unknown[];

    valueType?: SettingValueType;

    metadata?: Record<string, unknown>;

}



/**
 * ============================================================================
 * Setting Query
 *
 * Canonical filtering contract for settings repositories/services.
 * ============================================================================
 */
export interface SettingQuery {

    organizationId?: string;

    scope?: SettingScope;

    category?: SettingCategory;

    key?: string;

    isActive?: boolean;

}
