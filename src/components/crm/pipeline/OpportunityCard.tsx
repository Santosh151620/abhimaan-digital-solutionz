import type {
    PipelineOpportunity,
} from '@/types/crm/Pipeline';


interface Props {

    opportunity: PipelineOpportunity;

}



export default function OpportunityCard({

    opportunity,

}: Props) {


    return (

        <div className="rounded-lg border bg-white p-3 shadow-sm">


            <h3 className="font-medium">

                {opportunity.title}

            </h3>



            <p className="text-sm text-gray-500">

                {opportunity.companyId || '-'}

            </p>



            <p className="mt-2 font-semibold">

                {new Intl.NumberFormat(
                    'en-IN',
                    {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0,
                    },
                ).format(
                    opportunity.value,
                )}

            </p>



        </div>

    );

}