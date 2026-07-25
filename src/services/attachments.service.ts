import type { Attachment } from "@/types/crm/Attachment";

import { AttachmentsRepository } from "@/repositories/attachments.repository";


export class AttachmentsService {


    constructor(
        private readonly repository: AttachmentsRepository,
    ) {}


    getByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Attachment[]> {

        return this.repository.findByEntity(
            entityType,
            entityId,
        );

    }


    create(
        attachment: Partial<Attachment>,
    ): Promise<Attachment> {

        return this.repository.create(
            attachment,
        );

    }

}