'use server';


import {
    NotesServiceInstance,
} from '@/services/crm/NotesService';

import type {
    Note,
} from '@/types/crm/Notes';



export async function createNote(
    data: Partial<Note>
) {

    return NotesServiceInstance.create(
        data
    );

}



export async function updateNote(
    id: string,
    data: Partial<Note>
) {

    return NotesServiceInstance.update(
        id,
        data
    );

}



export async function deleteNote(
    id: string
) {

    return NotesServiceInstance.delete(
        id
    );

}