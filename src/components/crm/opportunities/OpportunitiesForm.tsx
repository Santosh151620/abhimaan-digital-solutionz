'use client';


import {
    useState,
} from 'react';

import type {
    Opportunity,
} from '@/types/crm/Opportunities';



interface Props {

    initialValues?: Partial<Opportunity>;

    onSubmit: (
        values: Partial<Opportunity>,
    ) => Promise<void>;

    onCancel?: () => void;

}



export default function OpportunitiesForm({
    initialValues = {},
    onSubmit,
    onCancel,
}: Props) {


    const [name, setName] =
        useState(
            initialValues.name ?? '',
        );


    async function submit(
        e: React.FormEvent,
    ) {

        e.preventDefault();


        await onSubmit({
            ...initialValues,
            name,
        });

    }



    return (

        <form
            onSubmit={submit}
            className="space-y-4"
        >

            <input
                className="border p-2 w-full"
                value={name}
                onChange={
                    e => setName(e.target.value)
                }
                placeholder="Opportunity name"
            />


            <div className="flex gap-2">

                <button
                    type="submit"
                    className="border px-4 py-2"
                >
                    Save Opportunity
                </button>


                {
                    onCancel &&
                    (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="border px-4 py-2"
                        >
                            Cancel
                        </button>
                    )
                }

            </div>


        </form>

    );

}

