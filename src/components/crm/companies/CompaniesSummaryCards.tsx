'use client';

import { useMemo } from 'react';
import { useCompanies } from '@/hooks/crm/useCompanies';

export function CompaniesSummaryCards() {
    const { data = [] } = useCompanies();

    const summary = useMemo(() => {

        return {
            total: data.length,

            active: data.filter(
                c => c.status === 'ACTIVE'
            ).length,

            prospects: data.filter(
                c => c.status === 'PROSPECT'
            ).length,

            inactive: data.filter(
                c => c.status === 'INACTIVE'
            ).length,
        };

    }, [data]);

    const cards = [
        {
            title: 'Total Companies',
            value: summary.total,
        },
        {
            title: 'Active',
            value: summary.active,
        },
        {
            title: 'Prospects',
            value: summary.prospects,
        },
        {
            title: 'Inactive',
            value: summary.inactive,
        },
    ];

    return (
        <section className="grid gap-4 md:grid-cols-4">

            {cards.map(card => (

                <div
                    key={card.title}
                    className="rounded-xl border bg-background p-5 shadow-sm"
                >
                    <p className="text-sm text-muted-foreground">
                        {card.title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        {card.value}
                    </h2>
                </div>

            ))}

        </section>
    );
}




