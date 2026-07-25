/**
 * ============================================================================
 * License
 * Enterprise Subscription Contract
 * CRM + ERP Compatible
 * Production Contract
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

    organizationId: string;


    type: LicenseType;


    status: LicenseStatus;


    activatedOn: string;


    expiresOn?: string;


    maxUsers: number;


    maxStorageGb: number;


    maxOrganizations: number;


    enabledModules: string[];


    enabledFeatures: string[];


    active: boolean;


    metadata?: Record<string, unknown>;


    createdBy?: string;


    updatedBy?: string;

}