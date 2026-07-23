'use client';


import Link from 'next/link';


import {
    ActivityForm,
} from '@/components/crm/activities';



export default function NewActivityPage() {


    async function handleSubmit() {


        // Temporary client handler.
        // Server action wiring will be connected in API/service integration phase.


    }



    return (

        <div className="space-y-6">


            <h1 className="text-2xl font-semibold">

                Create Activity

            </h1>



            <ActivityForm

                onSubmit={
                    handleSubmit
                }

            />



            <Link

                href="/crm/activities"

                className="text-sm underline"

            >

                Back to Activities

            </Link>


        </div>

    );

}