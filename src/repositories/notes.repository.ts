import type {
    Note,
} from '@/types/notes';

type QueryResult<T> = {
    data: T | null;
    error: Error | null;
};

export class NotesRepository {

    private readonly notes =
        new Map<string, Note>();

    private readonly supabase?: unknown;

    constructor(
        supabase?: unknown
    ) {

        this.supabase =
            supabase;

    }

    async findByEntity(
        entityType: string,
        entityId: string
    ): Promise<Note[]> {

        if (!this.supabase) {

            return Array.from(
                this.notes.values()
            ).filter(
                note =>
                    note.entityType === entityType &&
                    note.entityId === entityId
            );

        }

        const client =
            this.supabase as {

                from(
                    table: string
                ): {

                    select(
                        columns?: string
                    ): {

                        eq(
                            column: string,
                            value: string
                        ): {

                            eq(
                                column: string,
                                value: string
                            ): Promise<QueryResult<Note[]>>;

                        };

                    };

                };

            };

        const {
            data,
            error,
        } = await client
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

    async create(
        data: Partial<Note>
    ): Promise<Note> {

        const note: Note = {

            id:
                crypto.randomUUID(),

            entityType:
                data.entityType ?? '',

            entityId:
                data.entityId ?? '',

            title:
                data.title ?? '',

            content:
                data.content ?? '',

            isPinned:
                data.isPinned ?? false,

            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString(),

            createdBy:
                data.createdBy ?? null,

            updatedBy:
                data.updatedBy ?? null,

        };

        this.notes.set(
            note.id,
            note
        );

        return note;

    }

}