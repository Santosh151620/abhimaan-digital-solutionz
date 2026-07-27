'use client';


import {
    useState,
} from 'react';


import type {
    Note,
} from '@/types/crm/Notes';




interface Props {


    loading?: boolean;


    onSubmit?: (

        values: Partial<Note>

    ) => void | Promise<void>;


}




export default function NotesForm({

    loading = false,

    onSubmit,

}: Props) {



    const [
        title,
        setTitle,
    ] =
        useState('');



    const [
        content,
        setContent,
    ] =
        useState('');





    async function submit() {



        if (!title.trim()) {

            alert(
                'Note title is required.',
            );

            return;

        }




        await onSubmit?.({

            title,

            content,

            entityType:
                'Other',

            entityId:
                crypto.randomUUID(),

        });





        setTitle('');

        setContent('');

    }





    return (


        <div className="space-y-4 rounded-xl border p-6">



            <input


                className="w-full rounded border px-3 py-2"


                placeholder="Note title"


                value={
                    title
                }


                onChange={

                    event =>

                        setTitle(

                            event.target.value,

                        )

                }


            />





            <textarea


                className="w-full rounded border px-3 py-2"


                placeholder="Note content"


                rows={5}


                value={
                    content
                }


                onChange={

                    event =>

                        setContent(

                            event.target.value,

                        )

                }


            />





            <button


                type="button"


                disabled={
                    loading
                }


                onClick={
                    submit
                }


                className="rounded bg-primary px-4 py-2 text-primary-foreground"


            >


                {

                    loading

                    ?

                    'Saving...'

                    :

                    'Save Note'

                }


            </button>



        </div>


    );


}