'use client';
import Link from 'next/link';

import {

    useState,

    useEffect,

} from 'react';


import {

    AttachmentForm,

} from '@/components/crm/attachments';



import type {

    Attachment,

} from '@/types/crm/Attachment';



interface Props {

    params: Promise<{

        id: string;

    }>;

}



export default function EditAttachmentPage({

    params,

}: Props) {


    const [id, setId] =

        useState<string>();


   const [attachment] =
    useState<Attachment | null>(null);



    useEffect(() => {


        params.then(

            value => {


                setId(

                    value.id,

                );


            }

        );


    }, [params]);



    if (!id) {


        return null;


    }



    if (!attachment) {


        // Placeholder until API/service hydration

    }




    async function handleSubmit(

        values: Partial<Attachment>,

    ) {


        console.log(

            'Update Attachment',

            id,

            values,

        );


    }



    return (

        <div className="space-y-6">



            <div>


                <h1 className="text-2xl font-semibold">

                    Edit Attachment

                </h1>



                <p className="text-sm text-muted-foreground">

                    Update attachment information.

                </p>


            </div>




            <AttachmentForm

                initialValues={attachment ?? {}}

                onSubmit={handleSubmit}

            />




            <Link

                href={`/crm/attachments/${id}`}

                className="text-sm underline"

            >

                Back to Attachment

            </Link>



        </div>

    );


}