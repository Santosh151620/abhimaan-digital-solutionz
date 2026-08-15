/**
 * ============================================================================
 * Abhimaan Digital Solutionz
 *
 * License
 *
 * Enterprise Subscription Contract
 * CRM + Admin Compatible
 * Production SaaS Contract
 * ============================================================================
 *
 * Organization-level product entitlement.
 *
 * License determines what an organization is entitled to use.
 * FeatureFlag determines runtime feature availability.
 *
 * Enforcement belongs to the service/repository/policy layers.
 * Database/RLS must enforce organization ownership.
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";



/**
 * Subscription/product entitlement type.
 */
export type LicenseType =
    | "Trial"
    | "CRM"
    | "ERP"
    | "CRM+ERP"
    | "Enterprise";



/**
 * License lifecycle state.
 */
export type LicenseStatus =
    | "Active"
    | "Expired"
    | "Suspended"
    | "Cancelled";



/**
 * Organization subscription/license contract.
 */
export interface License
    extends BaseEntity {


    /**
     * Tenant ownership.
     *
     * Every license belongs to exactly one organization.
     */
    organizationId: string;



    /**
     * Subscription/product plan.
     */
    type: LicenseType;



    /**
     * Current lifecycle state.
     */
    status: LicenseStatus;



    /**
     * License activation timestamp.
     */
    activatedOn: string;



    /**
     * Optional license expiry timestamp.
     */
    expiresOn?: string;



    /**
     * Maximum number of users permitted by the license.
     */
    maxUsers: number;



    /**
     * Maximum storage allocation in GB.
     */
    maxStorageGb: number;



    /**
     * Maximum organizations permitted by the license.
     *
     * This is primarily relevant to platform/enterprise licensing.
     */
    maxOrganizations: number;



    /**
     * Product modules entitled by this license.
     *
     * Examples:
     * CRM, ERP, AI, Analytics.
     */
    enabledModules: string[];



    /**
     * Feature identifiers entitled by this license.
     *
     * Runtime activation should additionally respect FeatureFlag state.
     */
    enabledFeatures: string[];



    /**
     * Fast runtime entitlement check.
     *
     * This should be derived/validated against status and dates by the
     * license service rather than trusted blindly from client input.
     */
    active: boolean;



    /**
     * Additional non-sensitive subscription metadata.
     */
    metadata?: Record<string, unknown>;



    /**
     * Audit ownership.
     */
    createdBy?: string;

    updatedBy?: string;

}