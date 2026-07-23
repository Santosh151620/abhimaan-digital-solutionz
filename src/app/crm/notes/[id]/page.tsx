'use client';


import {
    useState,
} from 'react';


import {
    updateNote,
} from '@/app/crm/notes/actions';



interface Props {

    params: {

        id: string;

    };

}



export default function EditNotePage({

    params,

}: Props) {


    const [title, setTitle] =
        useState('');


    const [content, setContent] =
        useState('');



    async function update() {


        await updateNote(

            params.id,

            {

                title,

                content,

            }

        );

    }



    return (

        <div className="p-6 space-y-6">


            <h1 className="text-2xl font-bold">

                Edit Note

            </h1>



            <input

                className="border rounded px-3 py-2 w-full"

                value={title}

                onChange={

                    e =>

                        setTitle(
                            e.target.value
                        )

                }

                placeholder="Title"

            />



            <textarea

                className="border rounded px-3 py-2 w-full"

                value={content}

                onChange={

                    e =>

                        setContent(
                            e.target.value
                        )

                }

                placeholder="Content"

            />



            <button

                type="button"

                onClick={update}

                className="bg-black text-white px-4 py-2 rounded"

            >

                Update Note

            </button>


        </div>

    );

}