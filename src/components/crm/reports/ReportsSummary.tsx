'use client';

import type {
    ReportSummary,
} from '@/types/crm/Reports';

interface Props {

    summary: ReportSummary;

}

export default function ReportsSummary({
    summary,
}: Props) {

    const cards = [

        {
            title: 'Total Reports',
            value: summary.total,
        },

        {
            title: 'Draft',
            value: summary.draft,
        },

        {
            title: 'Published',
            value: summary.published,
        },

        {
            title: 'Archived',
            value: summary.archived,
        },

        {
            title: 'Scheduled',
            value: summary.scheduled,
        },

        {
            title: 'Shared',
            value: summary.shared,
        },

    ];

    return (

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">

            {
                cards.map(card => (

                    <div
                        key={card.title}
                        className="rounded-xl border bg-background p-5"
                    >

                        <div className="text-sm text-muted-foreground">

                            {card.title}

                        </div>

                        <div className="mt-2 text-3xl font-bold">

                            {card.value}

                        </div>

                    </div>

                ))
            }

        </div>

    );

}
