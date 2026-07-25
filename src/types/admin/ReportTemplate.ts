/**
 * ============================================================================
 * Report Template
 * Enterprise Reporting Layout Contract
 * CRM + ERP Compatible
 * Production Contract
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export type ReportTemplateVisibility =
    | "Private"
    | "Organization";


export interface ReportTemplate extends BaseEntity {

    organizationId?: string;


    reportDefinitionId: string;


    name: string;


    description?: string;


    isSystem: boolean;


    isDefault: boolean;


    visibility: ReportTemplateVisibility;


    layout: Record<string, unknown>;


    createdBy?: string;


    updatedBy?: string;


    metadata?: Record<string, unknown>;

}