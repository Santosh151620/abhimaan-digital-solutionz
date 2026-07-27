/**
 * ============================================================================
 * License
 * Enterprise Subscription Contract
 * CRM + Admin Compatible
 * Production SaaS Contract
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export type LicenseType =
    | "Trial"
    | "CRM"
    | "ERP"
    | "CRM+ERP"
    | "Enterprise";


export type LicenseStatus =
    | "Active"
    | "Expired"
    | "Suspended"
    | "Cancelled";


export interface License extends BaseEntity {

    /**
     * Tenant ownership.
     */
    organizationId: string;


    /**
     * Subscription plan type.
     */
    type: LicenseType;


    /**
     * Current license lifecycle state.
     */
    status: LicenseStatus;


    /**
     * Activation date.
     */
    activatedOn: string;


    /**
     * Optional expiry date.
     */
    expiresOn?: string;


    /**
     * Resource limits.
     */
    maxUsers: number;


    maxStorageGb: number;


    maxOrganizations: number;


    /**
     * Enabled product modules.
     */
    enabledModules: string[];


    /**
     * Enabled feature flags.
     */
    enabledFeatures: string[];


    /**
     * Quick runtime check.
     */
    active: boolean;


    /**
     * Additional subscription metadata.
     */
    metadata?: Record<string, unknown>;


    createdBy?: string;


    updatedBy?: string;

}
