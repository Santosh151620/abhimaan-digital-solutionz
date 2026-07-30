/**
 * ============================================================================
 * ADS ENTERPRISE PLATFORM
 * Platform Settings Contract
 *
 * Enterprise Configuration
 * Multi-Tenant
 * SaaS / On-Prem
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";



export type SettingScope =
    | "Platform"
    | "Organization"
    | "Module"
    | "User";



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



export type SettingValueType =
    | "String"
    | "Number"
    | "Boolean"
    | "Json"
    | "Array";



export interface PlatformSetting
    extends BaseEntity {

    /**
     * Optional for platform-wide settings.
     */
    organizationId?: string;

    /**
     * Classification
     */
    scope: SettingScope;

    category: SettingCategory;

    /**
     * Unique configuration key.
     *
     * Example:
     * security.password.minLength
     * crm.pipeline.defaultStage
     */
    key: string;

    /**
     * Display
     */
    name: string;

    description?: string;

    /**
     * Value
     */
    value: string | number | boolean | Record<string, unknown> | unknown[];

    valueType: SettingValueType;

    /**
     * Protection
     */
    isSystem: boolean;

    isReadonly: boolean;

    isEncrypted: boolean;

    isVisible: boolean;

    /**
     * Validation
     */
    defaultValue?:
        | string
        | number
        | boolean
        | Record<string, unknown>
        | unknown[];

    allowedValues?: unknown[];

    validationExpression?: string;

    /**
     * Lifecycle
     */
    isActive: boolean;

    /**
     * Audit
     */
    createdBy?: string;

    updatedBy?: string;

    /**
     * Extension
     */
    metadata?: Record<string, unknown>;

}



/**
 * ============================================================================
 * Setting Group
 * ============================================================================
 */

export interface SettingGroup {

    category: SettingCategory;

    settings: PlatformSetting[];

}



/**
 * ============================================================================
 * Organization Settings Snapshot
 * ============================================================================
 */

export interface OrganizationSettings {

    organizationId: string;

    settings: PlatformSetting[];

}