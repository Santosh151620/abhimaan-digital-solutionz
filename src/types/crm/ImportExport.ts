export type ImportExportEntityType =
    | "Lead"
    | "Contact"
    | "Company"
    | "Opportunity"
    | "Quotation"
    | "Invoice"
    | "Project"
    | "Task"
    | "Ticket"
    | "Activity"
    | "Payment"
    | "Product"
    | "Contract"
    | "KnowledgeBase"
    | "Asset"
    | "Calendar"
    | "Notification"
    | "Report"
    | "Other";

export type ImportExportFormat =
    | "CSV"
    | "Excel"
    | "JSON";

type ImportExportStatus =
    | "Pending"
    | "Running"
    | "Completed"
    | "Failed";

export interface ImportExportColumn {

    key: string;

    label: string;

    required: boolean;

    type?:
        | "text"
        | "number"
        | "boolean"
        | "date"
        | "email"
        | "phone";

}

export interface ImportExportMapping {

    sourceColumn: string;

    targetField: string;

}

export interface ImportJob {

    id: string;

    entityType: ImportExportEntityType;

    fileName: string;

    format: ImportExportFormat;

    status: ImportExportStatus;

    totalRows: number;

    processedRows: number;

    successRows: number;

    failedRows: number;

    createdBy?: string;

    startedAt: string;

    completedAt?: string;

    createdAt: string;

    updatedAt: string;

}

export interface ExportJob {

    id: string;

    entityType: ImportExportEntityType;

    format: ImportExportFormat;

    status: ImportExportStatus;

    exportedRows: number;

    downloadUrl?: string;

    createdBy?: string;

    startedAt: string;

    completedAt?: string;

    createdAt: string;

    updatedAt: string;

}

export interface ImportRequest {

    entityType: ImportExportEntityType;

    format: ImportExportFormat;

    fileName: string;

    content: string;

    columns: ImportExportColumn[];

    options?: ImportOptions;

    mappings?: ImportExportMapping[];

}

export interface ExportRequest {

    entityType: ImportExportEntityType;

    format: ImportExportFormat;

    filters?: Record<string, unknown>;

}

export interface ImportExportSummary {

    totalImports: number;

    totalExports: number;

    running: number;

    completed: number;

    failed: number;

}
/**
 * ============================================================
 * Import / Export Platform Extensions
 * Enterprise CRM Standard
 * ============================================================
 */

type DuplicateHandlingStrategy =
    | "Skip"
    | "Reject"
    | "Update"
    | "Merge";

    export interface ImportExecutionOptions {

    content: string;

    format?: ImportExportFormat;

    columns: ImportExportColumn[];

    options?: ImportOptions;

}
interface ImportOptions {

    /**
     * Validate only.
     * No records are written.
     */
    dryRun?: boolean;

    /**
     * Continue processing after row failures.
     */
    continueOnError?: boolean;

    /**
     * Duplicate handling strategy.
     */
    duplicateStrategy?: DuplicateHandlingStrategy;

    /**
     * User selected mappings.
     */
    mappings?: ImportExportMapping[];

}

export interface ImportValidationError {

    row: number;

    column: string;

    value?: unknown;

    code?: string;

    message: string;

}

export interface ImportWarning {

    row: number;

    column?: string;

    message: string;

}

export interface ImportPreviewRow {

    rowNumber: number;

    values: Record<string, unknown>;

}

interface ImportPreview {

    totalRows: number;

    validRows: number;

    invalidRows: number;

    rows: ImportPreviewRow[];

    errors: ImportValidationError[];

    warnings: ImportWarning[];

}
interface ImportTemplate {

    entityType: ImportExportEntityType;

    fileName: string;

    format: ImportExportFormat;

    columns: ImportExportColumn[];

}

interface ImportDuplicateResult {

    row: number;

    duplicate: boolean;

    existingId?: string;

    reason?: string;

}

interface ImportHistoryItem {

    jobId: string;

    entityType: ImportExportEntityType;

    fileName: string;

    status: ImportExportStatus;

    startedAt: string;

    completedAt?: string;

}

export interface CsvTemplateColumn {

    header: string;

    required: boolean;

    sample?: string;

    description?: string;

}
interface ImportExecutionSummary {

    totalRows: number;

    importedRows: number;

    updatedRows: number;

    skippedRows: number;

    duplicateRows: number;

    failedRows: number;

    executionTimeMs: number;

}

export interface ImportExecutionResult {

    success: boolean;


    totalRows: number;


    importedRows: number;


    updatedRows: number;


    skippedRows: number;


    duplicateRows: number;


    failedRows: number;


    durationMs: number;


    summary: ImportExecutionSummary;


    errors: ImportValidationError[];


    validationErrors: ImportValidationError[];


    warnings: ImportWarning[];

}

interface DuplicateCheckResult {

    duplicate: boolean;

    reason?: string;

}

interface DuplicateRule {

    field: string;

    required: boolean;

}

export interface ImportConfiguration {

    entityType: ImportExportEntityType;

    columns: ImportExportColumn[];

    duplicateRules: DuplicateRule[];

}
interface ImportAcknowledgement {

    success: boolean;

    message: string;

    importedRows: number;

    updatedRows: number;

    skippedRows: number;

    duplicateRows: number;

    failedRows: number;

}





