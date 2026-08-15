import type {
    AuditLog,
} from "@/types/admin/AuditLog";


import {
    AuditLogsRepository,
} from "@/repositories/admin/AuditLogsRepository";



/**
 * ============================================================================
 * ADS ADMIN — AUDIT LOGS SERVICE
 * ============================================================================
 *
 * Read-only business-service boundary for administrative audit logs.
 *
 * Responsibilities:
 *
 * - Validate audit-log identifiers.
 * - Validate entity references.
 * - Normalize user-supplied lookup values.
 * - Delegate persistence/read operations to AuditLogsRepository.
 *
 * Audit records are intentionally not exposed through create/update/delete
 * operations here. Audit-log creation remains an infrastructure/domain concern
 * so callers cannot casually mutate the audit trail through the service layer.
 *
 * Security, organization isolation and persistence remain repository concerns.
 * ============================================================================
 */


export class AuditLogsService {


    constructor(

        private readonly repository:
            AuditLogsRepository =
                new AuditLogsRepository(),

    ) {}



    /**
     * Return all audit logs available to the repository context.
     */
    async list():

    Promise<AuditLog[]> {

        return this.repository.findAll();

    }



    /**
     * Find one audit log by identifier.
     */
    async findById(

        id: string,

    ):

    Promise<AuditLog | null> {

        const normalizedId =
            this.validateId(
                id,
            );


        return this.repository.findById(

            normalizedId,

        );

    }



    /**
     * Return audit logs associated with an entity.
     */
    async findByEntity(

        entityType: string,

        entityId: string,

    ):

    Promise<AuditLog[]> {

        const normalizedEntityType =
            this.validateEntityType(
                entityType,
            );


        const normalizedEntityId =
            this.validateId(
                entityId,
            );


        return this.repository.findByEntity(

            normalizedEntityType,

            normalizedEntityId,

        );

    }



    /**
     * Normalize and validate an entity type.
     *
     * Entity types are intentionally not restricted to a hard-coded union here.
     * The audit system may cover entities introduced by different modules.
     */
    private validateEntityType(

        entityType: string,

    ): string {

        if (
            typeof entityType !==
            "string"
        ) {

            throw new Error(

                "Entity type is required.",

            );

        }


        const normalizedEntityType =
            entityType.trim();


        if (!normalizedEntityType) {

            throw new Error(

                "Entity type is required.",

            );

        }


        return normalizedEntityType;

    }



    /**
     * Normalize and validate an identifier.
     */
    private validateId(

        id: string,

    ): string {

        if (
            typeof id !==
            "string"
        ) {

            throw new Error(

                "Id is required.",

            );

        }


        const normalizedId =
            id.trim();


        if (!normalizedId) {

            throw new Error(

                "Id is required.",

            );

        }


        return normalizedId;

    }

}



/**
 * Default application-level audit-log service.
 *
 * Kept as a singleton to preserve the existing application contract.
 */
export const auditLogsService =
    new AuditLogsService();