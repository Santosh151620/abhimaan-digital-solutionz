/**
 * ============================================================================
 * Abhimaan Digital Solutionz
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



/**
 * Audit event severity.
 */
export type AuditSeverity =
    | "Info"
    | "Warning"
    | "Error"
    | "Critical";



/**
 * Identity responsible for generating an audit event.
 */
export type AuditActorType =
    | "USER"
    | "SYSTEM"
    | "SERVICE";



/**
 * Canonical high-level audit action.
 */
export type AuditActionType =
    | "Create"
    | "Read"
    | "Update"
    | "Delete"
    | "Login"
    | "Logout"
    | "Export"
    | "Import";



/**
 * Enterprise audit record.
 *
 * Tenant ownership, authorization and persistence security remain enforced
 * by the repository/database layer.
 */
export interface AuditRecord
    extends BaseEntity {


    /**
     * Organization owning the audit event.
     *
     * Required for tenant-scoped audit records.
     */
    organizationId: string;



    /**
     * Application user associated with the action, when applicable.
     */
    userId?: string;



    /**
     * Actor identifier.
     *
     * May identify a user, service or system actor depending on actorType.
     */
    actorId?: string;



    /**
     * Type of actor responsible for the event.
     */
    actorType?: AuditActorType;



    /**
     * Primary module responsible for the event.
     *
     * Examples:
     * Admin, CRM, Workflow, Security.
     */
    module: string;



    /**
     * Optional originating sub-module.
     */
    sourceModule?: string;



    /**
     * Machine-readable event identifier.
     */
    eventType?: string;



    /**
     * Higher-level event classification.
     */
    eventCategory?: string;



    /**
     * Entity name associated with the audit event.
     */
    entity: string;



    /**
     * Optional entity type classification.
     */
    entityType?: string;



    /**
     * Identifier of the affected entity.
     */
    entityId: string;



    /**
     * Human-readable or domain-specific action name.
     */
    action: string;



    /**
     * Canonical action classification.
     */
    actionType: AuditActionType;



    /**
     * Human-readable event description.
     */
    description?: string;



    /**
     * Security/compliance severity.
     */
    severity: AuditSeverity;



    /**
     * Request/network context.
     *
     * Sensitive request data should only be retained according to the
     * platform's security and retention policy.
     */
    ipAddress?: string;

    userAgent?: string;

    requestId?: string;

    sessionId?: string;



    /**
     * State before the operation.
     *
     * Avoid storing secrets or credentials in audit snapshots.
     */
    beforeData?: Record<string, unknown>;



    /**
     * State after the operation.
     *
     * Avoid storing secrets or credentials in audit snapshots.
     */
    afterData?: Record<string, unknown>;



    /**
     * Additional non-sensitive event context.
     */
    metadata?: Record<string, unknown>;

}