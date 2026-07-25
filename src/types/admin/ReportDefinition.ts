/**
 * ============================================================================
 * Report Definition
 * Enterprise Reporting Contract
 * CRM + ERP Compatible
 * Production Contract
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export type ReportVisibility =
    | "Private"
    | "Organization"
    | "Public";


export type ReportCategory =
    | "CRM"
    | "ERP"
    | "Finance"
    | "Sales"
    | "Projects"
    | "Support"
    | "Operations"
    | "Custom";


export type ReportStatus =
    | "Draft"
    | "Active"
    | "Archived";


export interface ReportDefinition extends BaseEntity {

    organizationId?: string;


    moduleCodes: string[];


    name: string;


    description?: string;


    category: ReportCategory;


    visibility: ReportVisibility;


    status: ReportStatus;


    datasource: string;


    filters: Record<string, unknown>;


    columns: string[];


    sorting: string[];


    grouping: string[];


    active: boolean;


    version: number;


    createdBy?: string;


    updatedBy?: string;


    metadata?: Record<string, unknown>;

}