/**
 * ============================================================================
 * ADS ENTERPRISE PLATFORM
 * Organization Contract
 *
 * Enterprise Multi-Tenant
 * SaaS / On-Prem Ready
 * CRM + Admin Shared
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";



export type OrganizationStatus =
    | "Active"
    | "Inactive"
    | "Suspended"
    | "Archived"
    | "Pending";



export type OrganizationType =
    | "Customer"
    | "Partner"
    | "Internal"
    | "Vendor"
    | "Demo";



export interface Organization
    extends BaseEntity {

    /**
     * Business Identity
     */
    name: string;

    code: string;

    legalName?: string;

    displayName?: string;

    description?: string;

    type: OrganizationType;

    status: OrganizationStatus;

    /**
     * Contact
     */
    email?: string;

    phone?: string;

    website?: string;

    /**
     * Address
     */
    addressLine1?: string;

    addressLine2?: string;

    city?: string;

    state?: string;

    postalCode?: string;

    country?: string;

    /**
     * Business
     */
    taxId?: string;

    registrationNumber?: string;

    industry?: string;

    timezone?: string;

    locale?: string;

    currency?: string;

    /**
     * Subscription
     */
    planId?: string;

    subscriptionStatus?: string;

    trialEndsAt?: string;

    subscriptionEndsAt?: string;

    /**
     * Limits
     */
    maxUsers?: number;

    maxStorageGb?: number;

    maxApiRequestsPerDay?: number;

    /**
     * Lifecycle
     */
    isActive: boolean;

    isSystem: boolean;

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
 * Organization Member
 *
 * Mirrors organization membership assignments.
 * ============================================================================
 */

export interface OrganizationMember
    extends BaseEntity {

    organizationId: string;

    userId: string;

    roleId?: string;

    joinedAt: string;

    invitedBy?: string;

    invitationAcceptedAt?: string;

    isActive: boolean;

    metadata?: Record<string, unknown>;

}



/**
 * ============================================================================
 * Organization Summary
 *
 * Dashboard / Admin listing
 * ============================================================================
 */

export interface OrganizationSummary {

    id: string;

    name: string;

    code: string;

    status: OrganizationStatus;

    activeUsers: number;

    totalUsers: number;

    totalRoles: number;

    plan?: string;

    createdAt: string;

}