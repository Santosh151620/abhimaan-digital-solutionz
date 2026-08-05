import type {
    SupabaseClient,
} from '@supabase/supabase-js';

import {
    BaseRepository,
} from '@/lib/db/base-repository';

import type {
    Attachment,
    AttachmentSearchFilters,
    AttachmentSummary,
} from '@/types/crm/Attachment';


export class AttachmentRepository
    extends BaseRepository<Attachment> {


    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            'attachments',
        );

    }


    async list(
        entityType?: string,
        entityId?: string,
        includeArchived = false,
        includeDeleted = false,
    ): Promise<Attachment[]> {


        let query =
            this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId,
                );
        if (!includeArchived) {

            query =
                query.eq(
                    "archived",
                    false,
                );

        }

        if (!includeDeleted) {

            query =
                query.or(
                    "is_deleted.is.null,is_deleted.eq.false",
                );

        }

        if (entityType) {

            query =
                query.eq(
                    'entity_type',
                    entityType,
                );

        }


        if (entityId) {

            query =
                query.eq(
                    'entity_id',
                    entityId,
                );

        }


        const {
            data,
            error,
        } =
            await query.order(
                'uploaded_at',
                {
                    ascending: false,
                },
            );


        if (error) {

            throw error;

        }


        return (
            data ?? []
        ) as Attachment[];

    }



    async findById(
        id: string,
    ): Promise<Attachment | null> {

        return super.findById(
            id,
        );

    }



    async details(
        id: string,
    ): Promise<Attachment | null> {

        return this.findById(
            id,
        );

    }



    async listByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Attachment[]> {

        return this.list(
            entityType,
            entityId,
        );

    }

    async search(
        filters?: AttachmentSearchFilters,
    ): Promise<Attachment[]> {


        let query =
            this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId,
                );


        if (filters?.entityType) {

            query =
                query.eq(
                    'entity_type',
                    filters.entityType,
                );

        }


        if (filters?.entityId) {

            query =
                query.eq(
                    'entity_id',
                    filters.entityId,
                );

        }


        if (filters?.uploadedBy) {

            query =
                query.eq(
                    'uploaded_by',
                    filters.uploadedBy,
                );

        }


        if (filters?.mimeType) {

            query =
                query.eq(
                    "mime_type",
                    filters.mimeType,
                );
        }

        if (!filters?.includeArchived) {

            query =
                query.eq(
                    "archived",
                    false,
                );

        }

        if (!filters?.includeDeleted) {

            query =
                query.or(
                    "is_deleted.is.null,is_deleted.eq.false",
                );

        }

        const {
            data,
            error,
        } =
            await query.order(
                'uploaded_at',
                {
                    ascending: false,
                },
            );


        if (error) {

            throw error;

        }


        let attachments =
            (
                data ?? []
            ) as Attachment[];


        if (filters?.search) {

            const keyword =
                filters.search
                    .trim()
                    .toLowerCase();


            attachments =
                attachments.filter(
                    attachment =>
                        attachment.fileName
                            .toLowerCase()
                            .includes(keyword)

                        ||

                        attachment.fileType
                            .toLowerCase()
                            .includes(keyword)

                        ||

                        (attachment.mimeType ?? "")
                            .toLowerCase()
                            .includes(keyword)

                        ||

                        (attachment.description ?? "")
                            .toLowerCase()
                            .includes(keyword),
                );

        }

        return attachments;

    }
    async create(
        data: Partial<Attachment>,
    ): Promise<Attachment> {


        const now =
            new Date()
                .toISOString();


        return super.create(
            {

                ...data,

                uploadedAt:
                    data.uploadedAt
                    ??
                    now,


                createdAt:
                    now,


                updatedAt:
                    now,

            },
        );

    }



    async update(
        id: string,
        data: Partial<Attachment>,
    ): Promise<Attachment> {


        return super.update(
            id,
            {

                ...data,


                updatedAt:
                    new Date()
                        .toISOString(),

            },
        );

    }



    async delete(
        id: string,
    ): Promise<void> {


        const {
            error,
        } =
            await this.tableRef()
                .delete()
                .eq(
                    'organization_id',
                    this.organizationId,
                )

                .eq(
                    'id',
                    id,
                );


        if (error) {

            throw error;

        }

    }



    async summary(): Promise<AttachmentSummary> {


        const attachments =
            await this.list();


        return {

            total:
                attachments.length,


            active:
                attachments.length,


            archived:
                0,

        };

    }

}



export function createAttachmentRepository(
    supabase: SupabaseClient,
) {

    return new AttachmentRepository(
        supabase,
    );

}

export const AttachmentRepositoryInstance = {

    list(
        ...args: unknown[]
    ) {

        void args;

        throw new Error(
            'AttachmentRepositoryInstance requires Supabase context. Use createAttachmentRepository(supabase).list().',
        );

    },


    listByEntity(
        ...args: unknown[]
    ) {

        void args;

        throw new Error(
            'AttachmentRepositoryInstance requires Supabase context. Use createAttachmentRepository(supabase).listByEntity().',
        );

    },


    create(
        ...args: unknown[]
    ) {

        void args;

        throw new Error(
            'AttachmentRepositoryInstance requires Supabase context. Use createAttachmentRepository(supabase).create().',
        );

    },


    delete(
        ...args: unknown[]
    ) {

        void args;

        throw new Error(
            'AttachmentRepositoryInstance requires Supabase context. Use createAttachmentRepository(supabase).delete().',
        );

    },

};
