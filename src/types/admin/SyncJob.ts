/**
 * ============================================================================
 * Synchronization Job
 * Enterprise Integration Runtime Contract
 * CRM + ERP Compatible
 * Production Contract
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


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


export interface SyncJob extends BaseEntity {

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


    metadata?: Record<string, unknown>;


    createdBy?: string;


    updatedBy?: string;

}
