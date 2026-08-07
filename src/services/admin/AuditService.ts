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

        private readonly repository:
            IAuditRepository,

    ) {}







    async log(

        entry:AuditRecord,

    ):

    Promise<void> {


        this.validateAudit(

            entry,

        );



        await this.repository.log(

            {

                ...entry,


                createdAt:

                    entry.createdAt ??

                    new Date()

                        .toISOString(),

            },

        );


    }









    async getLogs(

        options?: {

            entityType?: string;

            entityId?: string;

            limit?: number;

        },

    ):

    Promise<AuditRecord[]> {



        return this.repository.getLogs(

            {

                entityType:

                    options?.entityType

                        ?.trim(),



                entityId:

                    options?.entityId

                        ?.trim(),



                limit:

                    this.normalizeLimit(

                        options?.limit,

                    ),

            },

        );


    }









    private validateAudit(

        entry:AuditRecord,

    ) {


        if(!entry.action?.trim()) {
            throw new Error(
                "Audit action is required.",

            );
        }
        if(!entry.entityType?.trim()) {


            throw new Error(
                "Audit entity type is required.",
            );
        }
        if(!entry.entityId?.trim()) {
            throw new Error(
                "Audit entity id is required.",

            );

        }
    }

    private normalizeLimit(
        limit?:number,

    ):

    number | undefined {
        if(
            limit === undefined
        ) {
            return undefined;
        }
        if(
            limit <= 0
        ) {
            throw new Error(
                "Audit limit must be greater than zero.",
            );
        }

        return Math.min(
            limit,
            500,
        );
    }

}