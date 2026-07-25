/**
 * ============================================================================
 * Enterprise Report Definition
 * ============================================================================
 */

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

export interface ReportDefinition {

    id: string;

    organizationId?: string;

    moduleCodes: string[];

    name: string;

    description?: string;

    category: ReportCategory;

    visibility: ReportVisibility;

    datasource: string;

    filters: Record<string, unknown>;

    columns: string[];

    sorting: string[];

    grouping: string[];

    active: boolean;

    version: number;

    createdBy: string;

    createdAt: string;

    updatedAt?: string;

}