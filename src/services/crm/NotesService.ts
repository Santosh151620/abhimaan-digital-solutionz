import {
    NotesRepositoryInstance,
} from '@/repositories/crm/NotesRepository';

import type {
    Note,
} from '@/types/crm/Notes';



class NotesService {


    list() {

        return NotesRepositoryInstance.list();

    }



    findById(
        id: string
    ) {

        return NotesRepositoryInstance.findById(
            id
        );

    }



    create(
        data: Partial<Note>
    ) {

        return NotesRepositoryInstance.create(
            data
        );

    }



    update(
        id: string,
        data: Partial<Note>
    ) {

        return NotesRepositoryInstance.update(
            id,
            data
        );

    }



    delete(
        id: string
    ) {

        return NotesRepositoryInstance.delete(
            id
        );

    }



    archive(
        id: string
    ) {

        return NotesRepositoryInstance.archive(
            id
        );

    }


}



export const NotesServiceInstance =
    new NotesService();