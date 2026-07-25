/**
 * ============================================================================
 * Audit
 * ============================================================================
 */

export type AuditSeverity =
    | "Info"
    | "Warning"
    | "Error"
    | "Critical";

export interface AuditRecord {

    id: string;

    organizationId: string;

    module: string;

    entity: string;

    entityId: string;

    action: string;

    severity: AuditSeverity;

    userId: string;

    ipAddress?: string;

    userAgent?: string;

    metadata?: Record<string, unknown>;

    createdAt: string;

}