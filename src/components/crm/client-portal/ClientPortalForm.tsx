'use client';


import {
    useState,
} from 'react';



export default function ClientPortalForm(){


    const [
        name,
        setName
    ] = useState('');



    return (

        <form className="space-y-4">


            <input

                className="border p-2 w-full"

                value={name}

                onChange={
                    event =>
                    setName(
                        event.target.value
                    )
                }

                placeholder="Portal name"

            />


            <button
                type="submit"
                className="border px-4 py-2"
            >

                Save

            </button>


        </form>

    );

}
