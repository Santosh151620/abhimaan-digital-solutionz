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
 *
 * Responsibilities:
 * - Validate audit records before persistence
 * - Normalize audit query filters
 * - Enforce safe audit query limits
 * - Delegate persistence to the audit repository
 *
 * Security:
 * - Tenant scoping remains the responsibility of the repository layer
 * - This service does not bypass repository security boundaries
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

        entry: AuditRecord,

    ):

    Promise<void> {

        const normalized =
            this.normalizeAudit(
                entry,
            );


        await this.repository.log(

            {

                ...entry,

                action:
                    normalized.action,

                entityType:
                    normalized.entityType,

                entityId:
                    normalized.entityId,

                createdAt:
                    this.normalizeCreatedAt(
                        entry.createdAt,
                    ),

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


        const entityType =
            typeof options?.entityType ===
            "string"
                ? options.entityType.trim()
                : undefined;


        const entityId =
            typeof options?.entityId ===
            "string"
                ? options.entityId.trim()
                : undefined;


        return this.repository.getLogs(

            {

                entityType:
                    entityType || undefined,

                entityId:
                    entityId || undefined,

                limit:
                    this.normalizeLimit(
                        options?.limit,
                    ),

            },

        );

    }



    private normalizeAudit(

        entry: AuditRecord,

    ): {

        action: string;

        entityType: string;

        entityId: string;

    } {


        if (!entry) {

            throw new Error(

                "Audit entry is required.",

            );

        }


        const action =
            typeof entry.action ===
            "string"
                ? entry.action.trim()
                : "";


        const entityType =
            typeof entry.entityType ===
            "string"
                ? entry.entityType.trim()
                : "";


        const entityId =
            typeof entry.entityId ===
            "string"
                ? entry.entityId.trim()
                : "";


        if (!action) {

            throw new Error(

                "Audit action is required.",

            );

        }


        if (!entityType) {

            throw new Error(

                "Audit entity type is required.",

            );

        }


        if (!entityId) {

            throw new Error(

                "Audit entity id is required.",

            );

        }


        return {

            action,

            entityType,

            entityId,

        };

    }



    private normalizeCreatedAt(

        createdAt?: string,

    ): string {

        const normalized =
            typeof createdAt ===
            "string"
                ? createdAt.trim()
                : "";


        return (

            normalized ||

            new Date()
                .toISOString()

        );

    }



    private normalizeLimit(

        limit?: number,

    ):

    number | undefined {


        if (

            limit === undefined

        ) {

            return undefined;

        }


        if (

            !Number.isFinite(
                limit,
            )

        ) {

            throw new Error(

                "Audit limit must be a finite number.",

            );

        }


        if (

            limit <= 0

        ) {

            throw new Error(

                "Audit limit must be greater than zero.",

            );

        }


        return Math.min(

            Math.floor(
                limit,
            ),

            500,

        );

    }

}