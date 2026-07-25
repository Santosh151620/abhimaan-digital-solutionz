/**
 * ============================================================================
 * Audit
 * ============================================================================
 */

export type AuditAction =
    | 'Create'
    | 'Update'
    | 'Delete'
    | 'Login'
    | 'Logout'
    | 'Assign'
    | 'Approve'
    | 'Export'
    | 'Import';

export interface AuditLog {

    id: string;

    organizationId?: string;

    entityType: string;

    entityId: string;

    action: AuditAction;

    performedBy: string;

    performedAt: string;

    ipAddress?: string;

    userAgent?: string;

    description?: string;

    metadata?: Record<string, unknown>;

}