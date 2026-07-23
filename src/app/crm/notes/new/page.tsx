import {
    NotesForm,
} from '@/components/crm/notes';



export default function NewNotePage() {


    return (

        <div className="p-6 space-y-6">


            <div>

                <h1 className="text-2xl font-bold">

                    Create Note

                </h1>


                <p className="text-sm text-gray-500">

                    Add a new CRM note.

                </p>

            </div>



            <NotesForm />


        </div>

    );

}