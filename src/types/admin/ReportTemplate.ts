/**
 * ============================================================================
 * Report Template
 * Enterprise Reporting Layout Contract
 * CRM + Admin Compatible
 * Production SaaS Contract
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export type ReportTemplateVisibility =
    | "Private"
    | "Organization";


export type ReportTemplateType =
    | "Table"
    | "Chart"
    | "Dashboard"
    | "Export";


export interface ReportTemplate extends BaseEntity {

    /**
     * Tenant ownership.
     * Undefined means platform template.
     */
    organizationId?: string;


    /**
     * Parent report definition.
     */
    reportDefinitionId: string;


    name: string;


    description?: string;


    type: ReportTemplateType;


    visibility: ReportTemplateVisibility;


    /**
     * System templates cannot be modified
     * by organization users.
     */
    isSystem: boolean;


    /**
     * Default template selection.
     */
    isDefault: boolean;


    /**
     * UI layout configuration.
     */
    layout: Record<string, unknown>;


    metadata?: Record<string, unknown>;


    createdBy?: string;


    updatedBy?: string;

}