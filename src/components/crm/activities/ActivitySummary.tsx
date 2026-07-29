import type {
    ActivitySummary as ActivitySummaryType,
} from '@/types/crm/Activities';



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
            label: 'Overdue',
            value: summary.overdue,
        },

        {
            label: 'Upcoming',
            value: summary.upcoming,
        },

        {
            label: 'High Priority',
            value: summary.highPriority,
        },

        {
            label: 'Completion',
            value: `${summary.completionRate}%`,
        },

    ];



    return (

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


            {
                cards.map(card => (

                    <div

                        key={card.label}

                        className="rounded-xl border bg-card p-4"

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
