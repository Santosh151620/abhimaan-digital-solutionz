import {
    NotesRepository,
} from '@/repositories/notes.repository';

import type {
    Note,
} from '@/types/notes';

export class NotesService {

    constructor(
        private readonly repository: NotesRepository,
    ) {}

    findByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Note[]> {

        return this.repository.findByEntity(
            entityType,
            entityId,
        );

    }

}

export default NotesService;