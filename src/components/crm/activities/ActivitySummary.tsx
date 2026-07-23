import type {
    ActivitySummary as ActivitySummaryType,
} from '@/types/crm/Activity';



interface Props {

    summary: ActivitySummaryType;

}



export default function ActivitySummary({

    summary,

}: Props) {


    const cards = [

        {
            label: 'Total',
            value: summary.total,
        },

        {
            label: 'Planned',
            value: summary.planned,
        },

        {
            label: 'In Progress',
            value: summary.inProgress,
        },

        {
            label: 'Completed',
            value: summary.completed,
        },

        {
            label: 'Cancelled',
            value: summary.cancelled,
        },

        {
            label: 'Missed',
            value: summary.missed,
        },

    ];



    return (

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">


            {
                cards.map(card => (

                    <div

                        key={card.label}

                        className="rounded-xl border p-4"

                    >

                        <div className="text-sm text-muted-foreground">

                            {card.label}

                        </div>


                        <div className="mt-2 text-2xl font-semibold">

                            {card.value}

                        </div>


                    </div>


                ))
            }


        </div>

    );


}