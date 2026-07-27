import type {
    Note,
    NoteSummary,
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
        supabase?: SupabaseClient,
    ) {

        this.supabase =
            supabase;

    }
    async list(): Promise<Note[]> {
        return Array.from(
            this.notes.values(),
        )
            .filter(
                note =>
                    !note.archived,
            );
    }
    async listArchived(): Promise<Note[]> {

        return Array.from(
            this.notes.values(),
        )
            .filter(
                note =>
                    note.archived,
            );
    }

    async findById(
        id: string,
    ): Promise<Note | null> {
        return (
            this.notes.get(id)
            ??
            null
        );
    }

    async findByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Note[]> {
        if (!this.supabase) {
            return Array.from(
                this.notes.values(),
            )
                .filter(
                    note =>
                        note.entityType === entityType
                        &&
                        note.entityId === entityId,
                );
        }
        const {
            data,
            error,
        }
            =
            await this.supabase
                .from<Note[]>('notes')
                .select('*')
                .eq(
                    'entity_type',
                    entityType,
                )
                .eq(
                    'entity_id',
                    entityId,
                );
        if (error) {
            throw error;
        }
        return data ?? [];

    }

    async create(
        data: Partial<Note>,
    ): Promise<Note> {

        const now =
            new Date().toISOString();
        const note: Note = {
            id:
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
        };

        this.notes.set(
            note.id,
            note,
        );

        return note;
    }

    async update(
        id: string,
        data: Partial<Note>,
    ): Promise<Note | null> {

        const existing =
            this.notes.get(id);
        if (!existing) {
            return null;
        }
        const updated: Note = {
            ...existing,
            ...data,
            updatedAt:
                new Date().toISOString(),
        };

        this.notes.set(
            id,
            updated,
        );
        return updated;

    }
    async delete(
        id: string,
    ): Promise<boolean> {

        return this.notes.delete(
            id,
        );

    }

    async archive(
        id: string,
    ): Promise<Note | null> {
        const existing =
            this.notes.get(id);

        if (!existing) {
            return null;
        }
        const updated: Note = {
            ...existing,
            archived:
                true,
            updatedAt:
                new Date().toISOString(),
        };
        this.notes.set(
            id,
            updated,
        );
        return updated;
    }

    async restore(
        id: string,
    ): Promise<Note | null> {
        const existing =
            this.notes.get(id);
        if (!existing) {
            return null;
        }
        const updated: Note = {
            ...existing,
            archived:
                false,
            updatedAt:
                new Date().toISOString(),
        };
        this.notes.set(
            id,
            updated,
        );
        return updated;
    }
    async summary(): Promise<NoteSummary> {
        const notes =
            Array.from(
                this.notes.values(),
            );
        return {
            total:
                notes.length,
            active:
                notes.filter(
                    note =>
                        !note.archived,
                ).length,
            archived:
                notes.filter(
                    note =>
                        note.archived,
                ).length,
        };
    }
}
export const NotesRepositoryInstance =
    new NotesRepository();
