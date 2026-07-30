import type {
    AuditRecord,
} from "@/types/admin/Audit";



export interface IAuditRepository {


    /**
     * Create immutable audit entry
     */
    log(
        entry: AuditRecord
    ): Promise<void>;



    /**
     * Retrieve audit history
     */
    getLogs(
        options?: {
            entityType?: string;

            entityId?: string;

            limit?: number;
        }
    ): Promise<AuditRecord[]>;


}