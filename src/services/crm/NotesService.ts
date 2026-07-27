/**
 * CRM Notes Service
 *
 * Application service layer.
 *
 * Flow:
 *
 * API / Server Actions
 *          |
 *          ↓
 * NotesService
 *          |
 *          ↓
 * NotesRepository
 *          |
 *          ↓
 * Supabase
 */


import {
    createClient,
} from '@/lib/supabase/server';


import {
    createNotesRepository,
} from '@/repositories/crm/NotesRepository';


import type {
    Note,
    NoteSummary,
} from '@/types/crm/Notes';




class NotesService {


    private async repository() {

        const supabase =
            await createClient();


        return createNotesRepository(
            supabase,
        );

    }





    async list(): Promise<Note[]> {


        const repo =
            await this.repository();


        return repo.list();

    }





    async listArchived(): Promise<Note[]> {


        const repo =
            await this.repository();


        return repo.listArchived();

    }





    async findById(
        id: string,
    ): Promise<Note | null> {


        const repo =
            await this.repository();


        return repo.findById(
            id,
        );

    }

    async findByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Note[]> {


        const repo =
            await this.repository();


        return repo.findByEntity(
            entityType,
            entityId,
        );

    }





    async create(
        data: Partial<Note>,
    ): Promise<Note> {


        const repo =
            await this.repository();


        return repo.create(
            data,
        );

    }





    async update(
        id: string,
        data: Partial<Note>,
    ): Promise<Note | null> {


        const repo =
            await this.repository();


        return repo.update(
            id,
            data,
        );

    }
async delete(
    id: string,
): Promise<boolean> {


    const repo =
        await this.repository();


    await repo.delete(
        id,
    );


    return true;

}

    async archive(
        id: string,
    ): Promise<Note | null> {


        const repo =
            await this.repository();


        return repo.archive(
            id,
        );

    }





    async restore(
        id: string,
    ): Promise<Note | null> {


        const repo =
            await this.repository();


        return repo.restore(
            id,
        );

    }





    async summary(): Promise<NoteSummary> {


        const repo =
            await this.repository();


        return repo.summary();

    }


}




export const notesService =
    new NotesService();



export const NotesServiceInstance =
    notesService;