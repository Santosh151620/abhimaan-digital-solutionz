/**
 * ============================================================================
 * Organization
 * ============================================================================
 */

export type OrganizationStatus =
    | 'Active'
    | 'Suspended'
    | 'Archived';

export interface Organization {

    id: string;

    name: string;

    code: string;

    email?: string;

    phone?: string;

    website?: string;

    logoUrl?: string;

    timezone?: string;

    currency?: string;

    status: OrganizationStatus;

    createdAt: string;

    updatedAt?: string;

}

export interface OrganizationStatistics {

    users: number;

    projects: number;

    leads: number;

    opportunities: number;

    quotations: number;

    invoices: number;

    revenue: number;

}