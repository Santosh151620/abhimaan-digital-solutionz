import type {
    Note,
} from '@/types/crm/Notes';



interface Props {

    notes: Note[];

}



export default function NotesSummary({

    notes,

}: Props) {


    return (

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


            <div className="border rounded p-4">

                <div className="text-sm text-gray-500">

                    Total Notes

                </div>


                <div className="text-2xl font-bold">

                    {notes.length}

                </div>

            </div>



            <div className="border rounded p-4">

                <div className="text-sm text-gray-500">

                    Active

                </div>


                <div className="text-2xl font-bold">

                    {
                        notes.filter(
                            note =>
                                !note.archived
                        ).length
                    }

                </div>

            </div>



            <div className="border rounded p-4">

                <div className="text-sm text-gray-500">

                    Archived

                </div>


                <div className="text-2xl font-bold">

                    {
                        notes.filter(
                            note =>
                                note.archived
                        ).length
                    }

                </div>

            </div>


        </div>

    );

}