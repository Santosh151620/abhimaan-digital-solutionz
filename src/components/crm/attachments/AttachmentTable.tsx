'use client';


import Link from 'next/link';


import type {
    Attachment,
} from '@/types/crm/Attachment';



interface Props {

    attachments: Attachment[];

}



export default function AttachmentTable({

    attachments,

}: Props) {



    if (attachments.length === 0) {


        return (

            <div className="crm-card p-8 text-center text-muted-foreground">

                No attachments found.

            </div>

        );


    }



    return (

        <div className="overflow-x-auto rounded-xl border">


            <table className="w-full">


                <thead>


                    <tr className="border-b bg-muted/40 text-left">


                        <th className="p-3">

                            File

                        </th>


                        <th className="p-3">

                            Entity

                        </th>


                        <th className="p-3">

                            Type

                        </th>


                        <th className="p-3">

                            Size

                        </th>


                        <th className="p-3">

                            Action

                        </th>


                    </tr>


                </thead>




                <tbody>


                    {

                        attachments.map(

                            attachment => (


                                <tr

                                    key={
                                        attachment.id
                                    }

                                    className="border-b"

                                >


                                    <td className="p-3">


                                        <div className="font-medium">

                                            {
                                                attachment.fileName
                                            }

                                        </div>


                                        {

                                            attachment.description && (

                                                <div className="text-sm text-muted-foreground">

                                                    {
                                                        attachment.description
                                                    }

                                                </div>

                                            )

                                        }


                                    </td>




                                    <td className="p-3">

                                        {
                                            attachment.entityType
                                        }

                                    </td>




                                    <td className="p-3">

                                        {
                                            attachment.fileType ?? '-'
                                        }

                                    </td>




                                    <td className="p-3">

                                        {
                                            attachment.fileSize
                                                ? `${attachment.fileSize} bytes`
                                                : '-'
                                        }

                                    </td>




                                    <td className="p-3">


                                        <Link

                                            href={`/crm/attachments/${attachment.id}`}

                                            className="rounded border px-3 py-1 text-sm"

                                        >

                                            View

                                        </Link>


                                    </td>



                                </tr>


                            )

                        )

                    }


                </tbody>


            </table>


        </div>

    );


}