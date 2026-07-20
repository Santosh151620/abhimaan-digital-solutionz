'use client';


import {
    useState,
} from 'react';


import {
    createTaskAttachment,
    deleteTaskAttachment,
} from './attachment-actions';



import type {
    Attachment,
} from '@/types/crm/Attachment';



interface Props {

    taskId:string;

    initialAttachments:Attachment[];

}



export default function TaskAttachments({

    taskId,

    initialAttachments,

}:Props) {


    const [
        attachments,
        setAttachments,
    ] = useState(
        initialAttachments
    );



    const [
        fileName,
        setFileName,
    ] = useState('');



    async function addAttachment() {


        if (!fileName.trim()) {
            return;
        }



        const attachment =
            await createTaskAttachment(

                taskId,

                {
                    fileName,

                    fileUrl:
                        '#',

                }

            );



        setAttachments(
            previous => [

                ...previous,

                attachment,

            ]
        );


        setFileName('');

    }



    async function removeAttachment(
        id:string
    ) {


        await deleteTaskAttachment(
            id
        );


        setAttachments(
            previous =>
                previous.filter(
                    item =>
                        item.id !== id
                )
        );

    }




    return (

        <div className="space-y-4 rounded-lg border p-6">


            <h2 className="font-semibold">
                Attachments
            </h2>



            <div className="flex gap-2">


                <input

                    value={fileName}

                    onChange={
                        e =>
                            setFileName(
                                e.target.value
                            )
                    }

                    placeholder="File name"

                    className="rounded border px-3 py-2 flex-1"

                />


                <button

                    onClick={addAttachment}

                    className="rounded bg-primary px-4 py-2 text-primary-foreground"

                >

                    Add

                </button>


            </div>



            <div className="space-y-2">


                {
                    attachments.map(
                        attachment => (

                            <div

                                key={attachment.id}

                                className="flex justify-between rounded border p-3"

                            >

                                <span>
                                    {attachment.fileName}
                                </span>


                                <button

                                    onClick={
                                        () =>
                                            removeAttachment(
                                                attachment.id
                                            )
                                    }

                                    className="text-destructive text-sm"

                                >
                                    Delete
                                </button>


                            </div>

                        )
                    )
                }



                {
                    attachments.length === 0 && (

                        <p className="text-sm text-muted-foreground">
                            No attachments.
                        </p>

                    )
                }


            </div>


        </div>

    );

}