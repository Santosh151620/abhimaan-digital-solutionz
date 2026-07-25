/**
 * ============================================================================
 * Audit Record
 * Enterprise Audit & Compliance
 * CRM + ERP Compatible
 * Production Contract
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export type AuditSeverity =
    | "Info"
    | "Warning"
    | "Error"
    | "Critical";


export type AuditActionType =
    | "Create"
    | "Read"
    | "Update"
    | "Delete"
    | "Login"
    | "Logout"
    | "Export"
    | "Import";


export interface AuditRecord extends BaseEntity {

    organizationId: string;


    module: string;


    entity: string;


    entityId: string;


    action: string;


    actionType: AuditActionType;


    severity: AuditSeverity;


    userId: string;


    ipAddress?: string;


    userAgent?: string;


    requestId?: string;


    sessionId?: string;


    beforeData?: Record<string, unknown>;


    afterData?: Record<string, unknown>;


    metadata?: Record<string, unknown>;

}