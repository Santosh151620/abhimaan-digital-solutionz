'use client';


import {
    useState,
} from 'react';


import {
    createNote,
} from '@/app/crm/notes/actions';



export default function NotesForm() {


    const [title, setTitle] =
        useState('');


    const [content, setContent] =
        useState('');



    async function submit() {


        await createNote({

            title,

            content,

            entityType:
                'Other',

            entityId:
                '',

        });



        setTitle('');

        setContent('');

    }



    return (

        <div className="space-y-4">


            <input

                className="border rounded px-3 py-2 w-full"

                placeholder="Note title"

                value={title}

                onChange={
                    e =>
                        setTitle(
                            e.target.value
                        )
                }

            />



            <textarea

                className="border rounded px-3 py-2 w-full"

                placeholder="Note content"

                value={content}

                onChange={
                    e =>
                        setContent(
                            e.target.value
                        )
                }

            />



            <button

                type="button"

                className="rounded bg-black text-white px-4 py-2"

                onClick={submit}

            >

                Save Note

            </button>


        </div>

    );

}