'use client';


import type {
    Note,
} from '@/types/crm/Notes';



interface Props {

    notes: Note[];

}



export default function NotesTable({

    notes,

}: Props) {


    if (!notes.length) {

        return (

            <div className="text-sm text-gray-500">

                No notes available.

            </div>

        );

    }



    return (

        <div className="space-y-3">


            {
                notes.map(

                    note => (

                        <div

                            key={note.id}

                            className="border rounded p-4"

                        >

                            <div className="font-semibold">

                                {note.title}

                            </div>



                            <div className="text-sm mt-2">

                                {note.content}

                            </div>



                        </div>

                    )

                )
            }


        </div>

    );

}