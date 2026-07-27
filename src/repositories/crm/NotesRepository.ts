/**
 * CRM Notes Repository
 *
 * Production repository layer.
 *
 * Responsibilities:
 * - Supabase persistence
 * - Organization isolation
 * - Entity-driven notes
 * - CRUD operations
 */

import type {
    SupabaseClient,
} from '@supabase/supabase-js';

import {
    BaseRepository,
} from '@/lib/db/base-repository';

import type {
    Note,
    NoteSummary,
} from '@/types/crm/Notes';



export class NotesRepository
    extends BaseRepository<Note> {


    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            'notes',
        );

    }



    async list(): Promise<Note[]> {

        const {
            data,
            error,
        } =
            await this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .eq(
                    'archived',
                    false,
                )
                .order(
                    'created_at',
                    {
                        ascending: false,
                    },
                );


        if (error) {

            throw error;

        }


        return (
            data ?? []
        ) as Note[];

    }





    async listArchived(): Promise<Note[]> {


        const {
            data,
            error,
        } =
            await this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .eq(
                    'archived',
                    true,
                )
                .order(
                    'created_at',
                    {
                        ascending: false,
                    },
                );


        if (error) {

            throw error;

        }


        return (
            data ?? []
        ) as Note[];

    }





    async findByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Note[]> {


        const {
            data,
            error,
        } =
            await this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .eq(
                    'entity_type',
                    entityType,
                )
                .eq(
                    'entity_id',
                    entityId,
                )
                .eq(
                    'archived',
                    false,
                )
                .order(
                    'created_at',
                    {
                        ascending: false,
                    },
                );


        if (error) {

            throw error;

        }


        return (
            data ?? []
        ) as Note[];

    }





    async findById(
        id: string,
    ): Promise<Note | null> {

        return super.findById(
            id,
        );

    }





    async create(
        data: Partial<Note>,
    ): Promise<Note> {


        const now =
            new Date()
                .toISOString();


        return super.create({

            id:
                data.id
                ??
                crypto.randomUUID(),


            organizationId:
                data.organizationId,


            entityType:
                data.entityType
                ??
                'Other',


            entityId:
                data.entityId
                ??
                '',


            title:
                data.title
                ??
                '',


            content:
                data.content
                ??
                '',


            createdBy:
                data.createdBy,


            archived:
                false,


            createdAt:
                now,


            updatedAt:
                now,

        });


    }
async update(
    id: string,
    data: Partial<Note>,
): Promise<Note> {


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
    async archive(
        id: string,
    ): Promise<Note | null> {


        return this.update(

            id,

            {

                archived:
                    true,

            },

        );

    }

    async restore(
        id: string,
    ): Promise<Note | null> {


        return this.update(

            id,

            {

                archived:
                    false,

            },

        );

    }

   async delete(
    id: string,
): Promise<void> {


    await this.archive(
        id,
    );


}





    async summary(): Promise<NoteSummary> {


        const notes =
            await this.tableRef()
                .select(
                    'archived',
                )
                .eq(
                    'organization_id',
                    this.organizationId,
                );


        const rows =
            notes.data
            ??
            [];


        return {


            total:
                rows.length,


            active:
                rows.filter(
                    note =>
                        !note.archived,
                ).length,


            archived:
                rows.filter(
                    note =>
                        note.archived,
                ).length,


        };


    }


}



/**
 * Repository factory.
 */
export function createNotesRepository(
    supabase: SupabaseClient,
) {

    return new NotesRepository(
        supabase,
    );

}