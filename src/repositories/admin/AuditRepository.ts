export interface AuditEntry {

    id: string;

    organizationId: string;

    module: string;

    entity: string;

    entityId: string;

    action: string;

    userId: string;

    createdAt: string;

}

export interface IAuditRepository {

    log(

        entry: AuditEntry

    ): Promise<void>;

}