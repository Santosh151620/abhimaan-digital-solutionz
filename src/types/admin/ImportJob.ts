/**
 * ============================================================================
 * Import Job
 * Enterprise Data Import Contract
 * CRM + ERP Compatible
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export type ImportSource =
    | "CSV"
    | "Excel"
    | "JSON"
    | "XML"
    | "Database"
    | "REST API"
    | "ERP"
    | "CRM"
    | "Custom";


export type ImportStatus =
    | "Pending"
    | "Validating"
    | "Processing"
    | "Completed"
    | "CompletedWithWarnings"
    | "Failed"
    | "Cancelled";


export interface ImportJob extends BaseEntity {

    organizationId: string;


    moduleCode: string;


    entityType: string;


    source: ImportSource;


    fileName?: string;


    templateId?: string;


    status: ImportStatus;


    totalRecords: number;


    processedRecords: number;


    successfulRecords: number;


    failedRecords: number;


    skippedRecords: number;


    startedBy: string;


    startedAt: string;


    completedAt?: string;


    errorMessage?: string;


    metadata?: Record<string, unknown>;

}
