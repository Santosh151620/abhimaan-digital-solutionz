type AuditAction =

    | "CREATE"

    | "UPDATE"

    | "DELETE"

    | "LOGIN"

    | "LOGOUT"

    | "APPROVAL"

    | "RESTORE";





export interface AuditLog {



    id: string;





    organizationId?: string;





    userId?: string | null;





    userName?: string | null;





    action: AuditAction;





    entityType: string;





    entityId?: string | null;





    description?: string | null;





    metadata?: Record<string, unknown>;





    ipAddress?: string | null;





    userAgent?: string | null;





    createdAt?: string;



}