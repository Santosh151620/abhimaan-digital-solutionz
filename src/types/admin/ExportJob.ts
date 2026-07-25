/**
 * ============================================================================
 * Export Job
 * ============================================================================
 */

export type ExportFormat =
    | "CSV"
    | "Excel"
    | "PDF"
    | "JSON"
    | "XML";

export interface ExportJob {

    id: string;

    organizationId: string;

    moduleCode: string;

    reportId?: string;

    format: ExportFormat;

    totalRecords: number;

    generatedFile?: string;

    createdBy: string;

    createdAt: string;

    expiresAt?: string;

}