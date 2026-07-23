import {

    notFound,

} from 'next/navigation';



import Link from 'next/link';



import {

    AttachmentServiceInstance,

} from '@/services/crm/AttachmentService';



interface Props {

    params: Promise<{

        id: string;

    }>;

}



export default async function AttachmentDetailsPage({

    params,

}: Props) {



    const {

        id,

    } = await params;




    const attachment =

        AttachmentServiceInstance.details(

            id,

        );



    if (!attachment) {


        notFound();


    }




    return (

        <div className="space-y-6">



            <div className="crm-card p-6">



                <h1 className="text-2xl font-semibold">

                    {attachment.fileName}

                </h1>




                <div className="mt-6 grid gap-4 md:grid-cols-2">



                    <div>

                        <p className="text-sm text-muted-foreground">

                            Entity Type

                        </p>


                        <p>

                            {attachment.entityType}

                        </p>


                    </div>



                    <div>

                        <p className="text-sm text-muted-foreground">

                            Entity ID

                        </p>


                        <p>

                            {attachment.entityId}

                        </p>


                    </div>



                    <div>

                        <p className="text-sm text-muted-foreground">

                            File Type

                        </p>


                        <p>

                            {attachment.fileType ?? '-'}

                        </p>


                    </div>



                    <div>

                        <p className="text-sm text-muted-foreground">

                            File Size

                        </p>


                        <p>

                            {
                                attachment.fileSize
                                    ? `${attachment.fileSize} bytes`
                                    : '-'
                            }

                        </p>


                    </div>



                </div>




                {

                    attachment.description && (

                        <div className="mt-6">


                            <h2 className="font-semibold">

                                Description

                            </h2>



                            <p className="mt-2 text-sm">

                                {attachment.description}

                            </p>



                        </div>

                    )

                }



            </div>




            <Link

                href={`/crm/attachments/${id}/edit`}

                className="rounded border px-4 py-2 text-sm"

            >

                Edit Attachment

            </Link>



        </div>

    );


}