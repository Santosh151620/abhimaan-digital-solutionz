/**
 * ============================================================================
 * Abhimaan Digital Solutionz
 *
 * Audit Log
 *
 * Administrative Audit Log Contract
 * ============================================================================
 *
 * This contract represents the application-facing audit-log/read model.
 *
 * It intentionally remains separate from the enterprise AuditRecord contract.
 * AuditRecord is the richer ingestion/compliance model, while AuditLog is the
 * simpler administrative representation consumed by existing Admin services
 * and repositories.
 * ============================================================================
 */


/**
 * Supported administrative audit actions.
 */
export type AuditAction =
    | "CREATE"
    | "UPDATE"
    | "DELETE"
    | "LOGIN"
    | "LOGOUT"
    | "APPROVAL"
    | "RESTORE";



/**
 * Administrative audit-log record.
 */
export interface AuditLog {


    /**
     * Unique audit-log identifier.
     */
    id: string;



    /**
     * Organization associated with the event.
     *
     * Optional to preserve support for platform-level audit records.
     */
    organizationId?: string;



    /**
     * User responsible for the event, when applicable.
     */
    userId?: string | null;



    /**
     * Display name of the user responsible for the event.
     *
     * This is presentation/read-model data and should not be treated as the
     * authoritative identity reference.
     */
    userName?: string | null;



    /**
     * High-level administrative action.
     */
    action: AuditAction;



    /**
     * Type of entity affected by the event.
     */
    entityType: string;



    /**
     * Identifier of the affected entity, when applicable.
     */
    entityId?: string | null;



    /**
     * Human-readable explanation of the event.
     */
    description?: string | null;



    /**
     * Additional non-sensitive audit context.
     */
    metadata?: Record<string, unknown>;



    /**
     * Request source IP, when available.
     */
    ipAddress?: string | null;



    /**
     * Request user-agent, when available.
     */
    userAgent?: string | null;



    /**
     * Event creation timestamp.
     */
    createdAt?: string;

}