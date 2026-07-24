'use client';



import {
    useState,
} from 'react';



export default function ProductsForm(){

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
                    e =>
                    setName(
                        e.target.value
                    )
                }
                placeholder="Product name"
            />


            <button
                className="border px-4 py-2"
                type="submit"
            >
                Save Product
            </button>


        </form>

    );

}
