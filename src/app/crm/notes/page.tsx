import {
    NotesClient,
} from '@/components/crm/notes';


import {
    NotesServiceInstance,
} from '@/services/crm/NotesService';



export default async function NotesPage() {


    const notes =
        NotesServiceInstance.list();



    return (

        <div className="space-y-6 p-6">


            <div>

                <h1 className="text-2xl font-bold">

                    Notes

                </h1>


                <p className="text-sm text-gray-500">

                    Manage CRM notes across entities.

                </p>

            </div>



            <NotesClient

                notes={notes}

            />


        </div>

    );

}