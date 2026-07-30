/**
 * ============================================================================
 * ADS ENTERPRISE PLATFORM
 *
 * Audit Record
 *
 * Enterprise Audit & Compliance Contract
 *
 * Supports:
 * - Admin auditing
 * - CRM activity tracking
 * - Workflow auditing
 * - Security monitoring
 * - Compliance reporting
 *
 * Database:
 * audit.audit_events
 *
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";



export type AuditSeverity =
    | "Info"
    | "Warning"
    | "Error"
    | "Critical";



export type AuditActorType =
    | "USER"
    | "SYSTEM"
    | "SERVICE";



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


    /**
     * Tenant ownership
     */
    organizationId: string;



    /**
     * Who performed the action
     */
    userId?: string;


    actorId?: string;


    actorType?: AuditActorType;



    /**
     * Audit classification
     */
    module: string;


    sourceModule?: string;


    eventType?: string;


    eventCategory?: string;



    /**
     * Entity reference
     *
     * Entity driven architecture
     */
    entity: string;


    entityType?: string;


    entityId: string;



    /**
     * Action details
     */
    action: string;


    actionType: AuditActionType;



    description?: string;



    /**
     * Severity
     */
    severity: AuditSeverity;



    /**
     * Request context
     */
    ipAddress?: string;


    userAgent?: string;


    requestId?: string;


    sessionId?: string;



    /**
     * State snapshots
     */
    beforeData?: Record<string, unknown>;


    afterData?: Record<string, unknown>;



    /**
     * Additional context
     */
    metadata?: Record<string, unknown>;

}