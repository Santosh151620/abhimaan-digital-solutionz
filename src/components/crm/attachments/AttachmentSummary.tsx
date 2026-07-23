import type {
    AttachmentSummary as AttachmentSummaryType,
} from '@/types/crm/Attachment';



interface Props {

    summary: AttachmentSummaryType;

}



export default function AttachmentSummary({

    summary,

}: Props) {


    return (

        <div className="grid gap-4 md:grid-cols-3">


            <div className="crm-card p-5">


                <p className="text-sm text-muted-foreground">

                    Total Attachments

                </p>


                <h2 className="mt-2 text-2xl font-semibold">

                    {summary.total}

                </h2>


            </div>




            <div className="crm-card p-5">


                <p className="text-sm text-muted-foreground">

                    Active

                </p>


                <h2 className="mt-2 text-2xl font-semibold">

                    {summary.active}

                </h2>


            </div>




            <div className="crm-card p-5">


                <p className="text-sm text-muted-foreground">

                    Archived

                </p>


                <h2 className="mt-2 text-2xl font-semibold">

                    {summary.archived}

                </h2>


            </div>


        </div>

    );


}