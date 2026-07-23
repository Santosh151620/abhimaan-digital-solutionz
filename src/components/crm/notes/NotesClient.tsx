'use client';


import type {
    Note,
} from '@/types/crm/Notes';


import NotesTable from './NotesTable';

import NotesSummary from './NotesSummary';



interface Props {

    notes: Note[];

}



export default function NotesClient({

    notes,

}: Props) {


    return (

        <div className="space-y-6">


            <NotesSummary

                notes={notes}

            />


            <NotesTable

                notes={notes}

            />


        </div>

    );

}