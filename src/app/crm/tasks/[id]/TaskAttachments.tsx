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

    taskId: string;

    initialAttachments: Attachment[];

}



export default function TaskAttachments({

    taskId,

    initialAttachments,

}: Props) {



    const [

        attachments,

        setAttachments,

    ] = useState<Attachment[]>(

        initialAttachments,

    );



    const [

        fileName,

        setFileName,

    ] = useState('');



    const [

        fileUrl,

        setFileUrl,

    ] = useState('');




    async function handleCreate() {



        if (!fileName.trim()) {


            return;


        }



        const attachment =

            await createTaskAttachment({

                taskId,

                fileName,

                fileUrl,

            });



        setAttachments(

            previous => [

                ...previous,

                attachment,

            ]

        );



        setFileName('');

        setFileUrl('');


    }





    async function handleDelete(

        id: string,

    ) {



        await deleteTaskAttachment(

            id,

        );



        setAttachments(

            previous =>

                previous.filter(

                    item => item.id !== id,

                )

        );


    }





    return (

        <div className="space-y-6 rounded-xl border p-6">



            <div>


                <h2 className="text-lg font-semibold">

                    Attachments

                </h2>


            </div>




            <div className="grid gap-3 md:grid-cols-2">


                <input

                    className="rounded border p-2"

                    placeholder="File name"

                    value={fileName}

                    onChange={

                        event =>

                            setFileName(

                                event.target.value,

                            )

                    }

                />



                <input

                    className="rounded border p-2"

                    placeholder="File URL"

                    value={fileUrl}

                    onChange={

                        event =>

                            setFileUrl(

                                event.target.value,

                            )

                    }

                />


            </div>




            <button

                type="button"

                onClick={handleCreate}

                className="rounded bg-primary px-4 py-2 text-primary-foreground"

            >

                Add Attachment

            </button>




            <div className="space-y-2">


                {

                    attachments.map(

                        attachment => (


                            <div

                                key={attachment.id}

                                className="flex items-center justify-between rounded border p-3"

                            >


                                <div>


                                    <p className="font-medium">

                                        {attachment.fileName}

                                    </p>



                                    <p className="text-sm text-muted-foreground">

                                        {attachment.fileUrl}

                                    </p>


                                </div>



                                <button

                                    type="button"

                                    onClick={() =>

                                        handleDelete(

                                            attachment.id,

                                        )

                                    }

                                    className="text-sm underline"

                                >

                                    Delete

                                </button>


                            </div>


                        )

                    )

                }


            </div>


        </div>

    );


}