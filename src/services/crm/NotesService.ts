import {
    NotesRepositoryInstance,
} from '@/repositories/crm/NotesRepository';


import type {
    Note,
    NoteSummary,
} from '@/types/crm/Notes';



class NotesService {



    async list(): Promise<Note[]> {


        return NotesRepositoryInstance.list();


    }





    async listArchived(): Promise<Note[]> {


        return NotesRepositoryInstance.listArchived();


    }





    async findById(
        id: string,
    ): Promise<Note | null> {


        return NotesRepositoryInstance.findById(
            id,
        );


    }

    async findByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Note[]> {
        return NotesRepositoryInstance.findByEntity(
            entityType,
            entityId,
        );
    }
    async create(
        data: Partial<Note>,
    ): Promise<Note> {
        return NotesRepositoryInstance.create(
            data,
        );
    }
    async update(
        id: string,
        data: Partial<Note>,
    ): Promise<Note | null> {
        return NotesRepositoryInstance.update(
            id,
            data,
        );
    }
    async delete(
        id: string,
    ): Promise<boolean> {
        return NotesRepositoryInstance.delete(
            id,
        );
    }

    async archive(
        id: string,
    ): Promise<Note | null> {
        return NotesRepositoryInstance.archive(
            id,
        );
    }
    async restore(
        id: string,
    ): Promise<Note | null> {
        return NotesRepositoryInstance.restore(
            id,
        );
    }

    async summary(): Promise<NoteSummary> {
        return NotesRepositoryInstance.summary();
    }
}

export const NotesServiceInstance =
    new NotesService();