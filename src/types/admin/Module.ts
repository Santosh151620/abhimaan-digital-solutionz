/**
 * ============================================================================
 * Platform Module
 * CRM + ERP + Future Enterprise
 * ============================================================================
 */

export type ModuleCategory =
    | "Platform"
    | "CRM"
    | "ERP"
    | "AI"
    | "Integration"
    | "Reporting"
    | "Administration";

export type ModuleStatus =
    | "Active"
    | "Inactive"
    | "Preview"
    | "Deprecated";

export interface PlatformModule {

    id: string;

    code: string;

    name: string;

    description?: string;

    category: ModuleCategory;

    version: string;

    route: string;

    icon?: string;

    displayOrder: number;

    dependencies: string[];

    featureFlags: string[];

    enabledByDefault: boolean;

    tenantConfigurable: boolean;

    licenseRequired: boolean;

    supportsCRM: boolean;

    supportsERP: boolean;

    supportsStandalone: boolean;

    supportsEnterprise: boolean;

    status: ModuleStatus;

    isSystem: boolean;

    metadata?: Record<string, unknown>;

    createdAt: string;

    updatedAt?: string;

}