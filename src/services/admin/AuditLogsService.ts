import type {
    AuditLog,
} from "@/types/admin/AuditLog";

import {
    AuditLogsRepository,
} from "@/repositories/admin/AuditLogsRepository";

export class AuditLogsService {

    constructor(

        private readonly repository =
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

        this.validateId(
            id,
        );

        return this.repository.findById(
            id.trim(),
        );

    }

    async findByEntity(

        entityType: string,

        entityId: string,

    ):

    Promise<AuditLog[]> {

        this.validateEntityType(
            entityType,
        );

        this.validateId(
            entityId,
        );

        return this.repository.findByEntity(

            entityType.trim(),

            entityId.trim(),

        );

    }

    private validateEntityType(

        entityType: string,

    ): void {

        if (!entityType?.trim()) {

            throw new Error(
                "Entity type is required.",
            );

        }

    }

    private validateId(

        id: string,

    ): void {

        if (!id?.trim()) {

            throw new Error(
                "Id is required.",
            );

        }

    }

}

export const auditLogsService =
    new AuditLogsService();