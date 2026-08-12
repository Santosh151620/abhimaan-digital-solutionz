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



    organizationId?: string;



    scope: SettingScope;



    category: SettingCategory;



    key: string;



    name: string;



    description?: string;



    value:

        | string

        | number

        | boolean

        | Record<string, unknown>

        | unknown[];



    valueType: SettingValueType;



    isSystem: boolean;



    isReadonly: boolean;



    isEncrypted: boolean;



    isVisible: boolean;



    defaultValue?:

        | string

        | number

        | boolean

        | Record<string, unknown>

        | unknown[];



    allowedValues?: unknown[];



    validationExpression?: string;



    isActive: boolean;



    createdBy?: string;



    updatedBy?: string;



    metadata?: Record<string, unknown>;



}







export interface SettingGroup {



    category: SettingCategory;



    settings: PlatformSetting[];



}







export interface OrganizationSettings {



    organizationId: string;



    settings: PlatformSetting[];



}


