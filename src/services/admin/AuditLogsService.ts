import type {
    AuditLog,
} from "@/types/admin/AuditLog";


import {
    AuditLogsRepository,
} from "@/repositories/admin/AuditLogsRepository";


export class AuditLogsService {


    constructor(

        private readonly repository:
            AuditLogsRepository =
                new AuditLogsRepository(),

    ) {}


    async list():

    Promise<AuditLog[]> {

        return this.repository.findAll();

    }


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


    private validateEntityType(

        entityType: string,

    ): string {

        const normalizedEntityType =
            entityType?.trim();


        if (!normalizedEntityType) {

            throw new Error(

                "Entity type is required.",

            );

        }


        return normalizedEntityType;

    }


    private validateId(

        id: string,

    ): string {

        const normalizedId =
            id?.trim();


        if (!normalizedId) {

            throw new Error(

                "Id is required.",

            );

        }


        return normalizedId;

    }

}


export const auditLogsService =
    new AuditLogsService();