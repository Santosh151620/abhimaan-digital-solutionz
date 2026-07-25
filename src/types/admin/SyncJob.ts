/**
 * ============================================================================
 * Synchronization Job
 * ============================================================================
 */

export type SyncDirection =
    | "Import"
    | "Export"
    | "Bidirectional";

export type SyncStatus =
    | "Idle"
    | "Queued"
    | "Running"
    | "Completed"
    | "Failed";

export interface SyncJob {

    id: string;

    organizationId: string;

    integrationId: string;

    moduleCode: string;

    direction: SyncDirection;

    schedule: string;

    status: SyncStatus;

    lastRunAt?: string;

    nextRunAt?: string;

    totalProcessed?: number;

    lastError?: string;

    enabled: boolean;

    createdAt: string;

}