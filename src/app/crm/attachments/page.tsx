import {
    AttachmentClient,
} from '@/components/crm/attachments';


import {
    AttachmentRepositoryInstance,
} from '@/repositories/crm/AttachmentRepository';



export default async function AttachmentsPage() {


    const attachments =

        AttachmentRepositoryInstance.list(

            'Other',

            '',

        );



    return (

        <div className="space-y-6">


            <div>

                <h1 className="text-2xl font-semibold">

                    Attachments

                </h1>


                <p className="text-sm text-muted-foreground">

                    Manage CRM entity attachments.

                </p>

            </div>



            <AttachmentClient

                initialAttachments={attachments}

            />


        </div>

    );


}