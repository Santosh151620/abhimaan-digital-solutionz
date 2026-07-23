'use client';


import {
    useState,
} from 'react';



import AttachmentForm from './AttachmentForm';

import AttachmentTable from './AttachmentTable';

import AttachmentSummary from './AttachmentSummary';



import type {
    Attachment,
} from '@/types/crm/Attachment';



interface Props {

    initialAttachments: Attachment[];

}



export default function AttachmentClient({

    initialAttachments,

}: Props) {



    const [attachments] =

        useState<Attachment[]>(

            initialAttachments,

        );



    const summary = {


        total:

            attachments.length,



        active:

            attachments.filter(

                item => !item.archived,

            ).length,



        archived:

            attachments.filter(

                item => item.archived,

            ).length,


    };




    async function createAttachment(

        values: Partial<Attachment>,

    ) {


        console.log(

            'Create Attachment',

            values,

        );


    }




    return (

        <div className="space-y-8">


            <AttachmentSummary

                summary={summary}

            />



            <AttachmentForm

                onSubmit={createAttachment}

            />



            <AttachmentTable

                attachments={attachments}

            />


        </div>

    );


}