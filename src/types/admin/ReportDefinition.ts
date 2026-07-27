/**
 * ============================================================================
 * Report Definition
 * Enterprise Reporting Contract
 * CRM + Admin Compatible
 * Production SaaS Contract
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

    /**
     * Tenant ownership.
     * Undefined means platform report.
     */
    organizationId?: string;


    /**
     * Supported modules.
     */
    moduleCodes: string[];


    name: string;


    description?: string;


    category: ReportCategory;


    visibility: ReportVisibility;


    status: ReportStatus;


    /**
     * Data source identifier.
     */
    datasource: string;


    /**
     * Runtime filtering configuration.
     */
    filters: Record<string, unknown>;


    /**
     * Selected columns.
     */
    columns: string[];


    /**
     * Sorting configuration.
     */
    sorting: string[];


    /**
     * Grouping configuration.
     */
    grouping: string[];


    /**
     * Runtime activation flag.
     */
    active: boolean;


    /**
     * Report schema version.
     */
    version: number;


    metadata?: Record<string, unknown>;


    createdBy?: string;


    updatedBy?: string;

}
