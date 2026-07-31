import type { SupabaseClient } from "@supabase/supabase-js";

import {
    createAttachmentRepository,
} from "@/repositories/crm/AttachmentRepository";

import type {
    Attachment,
} from "@/types/crm/Attachment";


export class AttachmentsService {


    private readonly repository;


    constructor(
        supabase: SupabaseClient,
    ) {

        this.repository =
            createAttachmentRepository(
                supabase,
            );

    }



    async list(
        entityType?: string,
        entityId?: string,
    ): Promise<Attachment[]> {

        return this.repository.list(
            entityType,
            entityId,
        );

    }



    async findByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Attachment[]> {

        return this.repository.listByEntity(
            entityType,
            entityId,
        );

    }



    async create(
        payload: Partial<Attachment>,
    ) {

        return this.repository.create(
            payload,
        );

    }



    async delete(
        id: string,
    ) {

        return this.repository.delete(
            id,
        );

    }


}