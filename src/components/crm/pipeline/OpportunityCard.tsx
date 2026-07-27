import type {
    PipelineOpportunity,
} from '@/types/crm/Pipeline';

interface Props {

    opportunity: PipelineOpportunity;

}

export default function OpportunityCard({

    opportunity,

}: Props) {

    const amount = new Intl.NumberFormat(

        'en-IN',

        {

            style: 'currency',

            currency: 'INR',

            maximumFractionDigits: 0,

        },

    ).format(

        opportunity.value,

    );

    return (

        <div className="rounded-lg border bg-background p-3 shadow-sm transition-shadow hover:shadow-md">

            <h3 className="font-medium">

                {opportunity.title}

            </h3>

            <p className="mt-1 text-sm text-muted-foreground">

                Company: {opportunity.companyId || '-'}

            </p>

            <p className="mt-2 font-semibold">

                {amount}

            </p>

            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">

                <span>

                    {opportunity.probability}% Probability

                </span>

                <span>

                    {opportunity.stage}

                </span>

            </div>

        </div>

    );

}
