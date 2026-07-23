'use client';


import Link from 'next/link';



import {

    AttachmentForm,

} from '@/components/crm/attachments';



import type {

    Attachment,

} from '@/types/crm/Attachment';



export default function NewAttachmentPage() {



    async function handleSubmit(

        values: Partial<Attachment>,

    ) {


        console.log(

            'Create Attachment',

            values,

        );


    }



    return (

        <div className="space-y-6">



            <div>


                <h1 className="text-2xl font-semibold">

                    Create Attachment

                </h1>



                <p className="text-sm text-muted-foreground">

                    Add a new file attachment.

                </p>


            </div>




            <AttachmentForm

                onSubmit={handleSubmit}

            />




            <Link

                href="/crm/attachments"

                className="text-sm underline"

            >

                Back to Attachments

            </Link>



        </div>

    );


}