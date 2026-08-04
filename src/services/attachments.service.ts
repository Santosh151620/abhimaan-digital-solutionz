import type {
    SupabaseClient,
} from "@supabase/supabase-js";

import {
    createAttachmentRepository,
} from "@/repositories/crm/AttachmentRepository";

import type {
    Attachment,
    AttachmentSearchFilters,
    AttachmentSummary,
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



    async details(
        id: string,
    ): Promise<Attachment | null> {

        return this.repository.findById(
            id,
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



    async search(
        filters?: AttachmentSearchFilters,
    ): Promise<Attachment[]> {

        return this.repository.search(
            filters,
        );

    }



    async create(
        payload: Partial<Attachment>,
    ): Promise<Attachment> {

        return this.repository.create(
            payload,
        );

    }



    async update(
        id: string,
        payload: Partial<Attachment>,
    ): Promise<Attachment> {

        return this.repository.update(
            id,
            payload,
        );

    }



    async delete(
        id: string,
    ): Promise<void> {

        return this.repository.delete(
            id,
        );

    }



    async summary(): Promise<AttachmentSummary> {

        return this.repository.summary();

    }


}