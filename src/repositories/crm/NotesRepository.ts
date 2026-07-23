import type {
    Note,
} from '@/types/crm/Notes';

type SupabaseQueryResult<T> = Promise<{
    data: T | null;
    error: Error | null;
}>;


type SupabaseQueryBuilder<T> =
    PromiseLike<SupabaseQueryResult<T>> & {

        select(
            columns?: string
        ): SupabaseQueryBuilder<T>;

        eq(
            column: string,
            value: string
        ): SupabaseQueryBuilder<T>;

        insert(
            data: unknown
        ): SupabaseQueryBuilder<T>;

        single():
            SupabaseQueryResult<T>;
    };


type SupabaseClient = {

    from<T>(
        table: string
    ): SupabaseQueryBuilder<T>;

};

export class NotesRepository {


    private notes =
        new Map<string, Note>();


    private supabase?: SupabaseClient;



    constructor(
        supabase?: SupabaseClient
    ) {

        this.supabase =
            supabase;

    }



    list() {

        return Array.from(
            this.notes.values()
        )
        .filter(
            note =>
                !note.archived
        );

    }



    findById(
        id: string
    ) {

        return (
            this.notes.get(id)
            ?? null
        );

    }



    async findByEntity(
        entityType: string,
        entityId: string
    ) {


        if (!this.supabase) {

            return Array.from(
                this.notes.values()
            )
            .filter(
                note =>
                    note.entityType === entityType
                    &&
                    note.entityId === entityId
            );

        }



        const {
            data,
            error,
        } =
            await this.supabase
                .from('notes')
                .select('*')
                .eq(
                    'entity_type',
                    entityType
                )
                .eq(
                    'entity_id',
                    entityId
                );


        if (error) {

            throw error;

        }


        return data ?? [];

    }



    create(
        data: Partial<Note>
    ) {


        const note: Note = {

            id:
                crypto.randomUUID(),

            entityType:
                data.entityType ?? 'Other',

            entityId:
                data.entityId ?? '',

            title:
                data.title ?? '',

            content:
                data.content ?? '',

            createdBy:
                data.createdBy,

            archived:
                false,

            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString(),

        };



        this.notes.set(
            note.id,
            note
        );


        return note;

    }



    update(
        id: string,
        data: Partial<Note>
    ) {


        const existing =
            this.notes.get(id);


        if (!existing) {

            return null;

        }


        const updated = {

            ...existing,

            ...data,

            updatedAt:
                new Date().toISOString(),

        };


        this.notes.set(
            id,
            updated
        );


        return updated;

    }



    delete(
        id: string
    ) {

        return this.notes.delete(id);

    }



    archive(
        id: string
    ) {


        const existing =
            this.notes.get(id);


        if (!existing) {

            return null;

        }


        const updated = {

            ...existing,

            archived: true,

            updatedAt:
                new Date().toISOString(),

        };


        this.notes.set(
            id,
            updated
        );


        return updated;

    }

}

export const NotesRepositoryInstance =
    new NotesRepository();