/**
 * ============================================================================
 * Platform Module
 * CRM + ERP + Future Enterprise
 * Production Contract
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


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


export type ModuleDeploymentType =
    | "Core"
    | "Optional"
    | "Extension";


export interface PlatformModule extends BaseEntity {

    code: string;


    name: string;


    description?: string;


    category: ModuleCategory;


    version: string;


    deploymentType: ModuleDeploymentType;


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

}