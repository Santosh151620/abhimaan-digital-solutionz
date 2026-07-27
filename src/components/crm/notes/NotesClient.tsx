'use client';


import {
    useState,
} from 'react';


import type {
    Note,
} from '@/types/crm/Notes';


import {
    createNote,
} from '@/app/crm/notes/actions';


import NotesTable from './NotesTable';

import NotesSummary from './NotesSummary';

import NotesForm from './NotesForm';




interface Props {

    initialNotes: Note[];

}





export default function NotesClient({

    initialNotes,

}: Props) {


    const [
        notes,
        setNotes,
    ] =
        useState<Note[]>(
            initialNotes,
        );




    const [
        loading,
        setLoading,
    ] =
        useState(false);





    async function handleCreate(

        data: Partial<Note>,

    ) {


        try {


            setLoading(
                true,
            );


            const created =
                await createNote(
                    data,
                );



            if (created) {


                setNotes(

                    previous => [

                        created,

                        ...previous,

                    ],

                );


            }


        } finally {


            setLoading(
                false,
            );


        }


    }





    return (

        <div className="space-y-6">


            <NotesSummary

                notes={
                    notes
                }

            />



            <NotesForm

                onSubmit={
                    handleCreate
                }

                loading={
                    loading
                }

            />



            <NotesTable

                notes={
                    notes
                }

            />


        </div>

    );


}