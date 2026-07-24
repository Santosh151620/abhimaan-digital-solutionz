'use client';

import type { CalendarSummary as CalendarSummaryModel } from '@/types/crm/Calendar';

interface Props {
    summary: CalendarSummaryModel;
}

const cards = [
    {
        key: 'total',
        label: 'Total',
    },
    {
        key: 'scheduled',
        label: 'Scheduled',
    },
    {
        key: 'inProgress',
        label: 'In Progress',
    },
    {
        key: 'completed',
        label: 'Completed',
    },
    {
        key: 'cancelled',
        label: 'Cancelled',
    },
    {
        key: 'missed',
        label: 'Missed',
    },
    {
        key: 'today',
        label: 'Today',
    },
    {
        key: 'upcoming',
        label: 'Upcoming',
    },
] as const;

export default function CalendarSummary({
    summary,
}: Props) {

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(card => (
                <div
                    key={card.key}
                    className="rounded-lg border bg-card p-4"
                >
                    <p className="text-sm text-muted-foreground">
                        {card.label}
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                        {summary[card.key]}
                    </p>
                </div>
            ))}
        </div>
    );

}