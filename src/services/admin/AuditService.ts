/**
 * ============================================================================
 * ADS ENTERPRISE PLATFORM
 *
 * Audit Service
 *
 * Application layer for:
 * - Admin
 * - CRM
 * - Workflow
 * - Security events
 * ============================================================================
 */


import type {
    AuditRecord,
} from "@/types/admin/Audit";


import type {
    IAuditRepository,
} from "@/repositories/admin/AuditRepository";



export class AuditService {


    constructor(
        private readonly repository: IAuditRepository
    ) {}



    async log(
        entry: AuditRecord
    ): Promise<void> {


        await this.repository.log(
            entry
        );

    }




    async getLogs(
        options?: {

            entityType?: string;

            entityId?: string;

            limit?: number;

        }

    ): Promise<AuditRecord[]> {


        return this.repository.getLogs(
            options
        );

    }


}