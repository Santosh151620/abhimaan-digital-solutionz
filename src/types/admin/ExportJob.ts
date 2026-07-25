/**
 * ============================================================================
 * Export Job
 * Enterprise Data Export Contract
 * CRM + ERP Compatible
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export type ExportFormat =
    | "CSV"
    | "Excel"
    | "PDF"
    | "JSON"
    | "XML";


export type ExportStatus =
    | "Pending"
    | "Processing"
    | "Completed"
    | "Failed"
    | "Expired";


export interface ExportJob extends BaseEntity {

    organizationId: string;


    moduleCode: string;


    reportId?: string;


    format: ExportFormat;


    status?: ExportStatus;


    totalRecords: number;


    generatedFile?: string;


    fileSize?: number;


    createdBy: string;


    expiresAt?: string;


    metadata?: Record<string, unknown>;

}