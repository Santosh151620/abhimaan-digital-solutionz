import {
    notFound,
} from 'next/navigation';


import {
    NotesServiceInstance,
} from '@/services/crm/NotesService';



interface Props {

    params: Promise<{

        id: string;

    }>;

}



export default async function NoteDetailsPage({

    params,

}: Props) {


    const {

        id,

    } = await params;



    const note =

        NotesServiceInstance.findById(
            id
        );



    if (!note) {

        notFound();

    }



    return (

        <div className="p-6 space-y-4">


            <h1 className="text-2xl font-bold">

                {note.title}

            </h1>



            <div className="border rounded p-4">

                {note.content}

            </div>



            <div className="text-sm text-gray-500">

                Entity: {note.entityType}

            </div>


        </div>

    );

}