/**
 * ============================================================================
 * Organization
 * Enterprise Tenant Contract
 * CRM + Admin Compatible
 * Production Contract
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export type OrganizationStatus =
    | "Active"
    | "Suspended"
    | "Archived";


export type OrganizationType =
    | "Trial"
    | "Customer"
    | "Enterprise"
    | "Internal";


export interface Organization extends BaseEntity {

    name: string;


    code: string;


    email?: string;


    phone?: string;


    website?: string;


    logoUrl?: string;


    timezone?: string;


    currency?: string;


    type: OrganizationType;


    status: OrganizationStatus;


    metadata?: Record<string, unknown>;


    createdBy?: string;


    updatedBy?: string;

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
