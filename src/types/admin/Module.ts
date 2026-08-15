/**
 * ============================================================================
 * Abhimaan Digital Solutionz
 *
 * Platform Module
 *
 * CRM + ERP + Future Enterprise
 * Production Platform Contract
 * ============================================================================
 *
 * Defines a product/module registered with the ADS platform.
 *
 * Module availability is governed independently by:
 *
 *   PlatformModule
 *        ↓
 *   License entitlement
 *        ↓
 *   Feature flags
 *        ↓
 *   Organization configuration
 *        ↓
 *   User permissions
 *
 * A module being enabled does not itself grant user access.
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";



/**
 * Functional classification of a platform module.
 */
export type ModuleCategory =
    | "Platform"
    | "CRM"
    | "ERP"
    | "AI"
    | "Integration"
    | "Reporting"
    | "Administration";



/**
 * Module lifecycle state.
 */
export type ModuleStatus =
    | "Active"
    | "Inactive"
    | "Preview"
    | "Deprecated";



/**
 * How the module is deployed within the platform.
 */
export type ModuleDeploymentType =
    | "Core"
    | "Optional"
    | "Extension";



/**
 * Enterprise platform module contract.
 */
export interface PlatformModule
    extends BaseEntity {


    /**
     * Stable machine-readable module code.
     */
    code: string;



    /**
     * Human-readable module name.
     */
    name: string;



    /**
     * Optional module description.
     */
    description?: string;



    /**
     * Functional module category.
     */
    category: ModuleCategory;



    /**
     * Module semantic/version identifier.
     */
    version: string;



    /**
     * Deployment classification.
     */
    deploymentType: ModuleDeploymentType;



    /**
     * Primary application route for the module.
     */
    route: string;



    /**
     * Optional UI icon identifier.
     */
    icon?: string;



    /**
     * Navigation/display ordering.
     */
    displayOrder: number;



    /**
     * Other module codes required by this module.
     */
    dependencies: string[];



    /**
     * Feature flags associated with this module.
     */
    featureFlags: string[];



    /**
     * Whether the module is enabled for organizations by default.
     */
    enabledByDefault: boolean;



    /**
     * Whether organizations may independently configure the module.
     */
    tenantConfigurable: boolean;



    /**
     * Whether an applicable license entitlement is required.
     */
    licenseRequired: boolean;



    /**
     * Whether the module integrates with CRM capabilities.
     */
    supportsCRM: boolean;



    /**
     * Whether the module integrates with ERP capabilities.
     */
    supportsERP: boolean;



    /**
     * Whether the module can operate independently.
     */
    supportsStandalone: boolean;



    /**
     * Whether the module supports enterprise deployment.
     */
    supportsEnterprise: boolean;



    /**
     * Module lifecycle state.
     */
    status: ModuleStatus;



    /**
     * Platform-controlled/system module.
     *
     * System modules require elevated platform authority for modification
     * or deletion.
     */
    isSystem: boolean;



    /**
     * Extensible non-sensitive metadata.
     */
    metadata?: Record<string, unknown>;

}