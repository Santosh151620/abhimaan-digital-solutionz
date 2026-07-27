'use client';

import { useMemo } from 'react';

import { useCompanies } from '@/hooks/crm/useCompanies';

export function CompaniesSummaryCards() {

    const {
        data = [],
        isLoading,
    } = useCompanies();

    const summary = useMemo(() => {

        return {

            total:
                data.length,

            active:
                data.filter(
                    company =>
                        company.status === 'ACTIVE'
                ).length,

            prospects:
                data.filter(
                    company =>
                        company.status === 'PROSPECT'
                ).length,

            inactive:
                data.filter(
                    company =>
                        company.status === 'INACTIVE'
                ).length,

            archived:
                data.filter(
                    company =>
                        company.status === 'ARCHIVED'
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

        {
            title: 'Archived',
            value: summary.archived,
        },

    ];

    if (isLoading) {

        return (

            <div className="grid gap-4 md:grid-cols-5">

                {

                    Array.from({
                        length: 5,
                    }).map((_, index) => (

                        <div
                            key={index}
                            className="h-28 animate-pulse rounded-xl border bg-muted"
                        />

                    ))

                }

            </div>

        );

    }

    return (

        <section className="grid gap-4 md:grid-cols-5">

            {

                cards.map(card => (

                    <article
                        key={card.title}
                        className="rounded-xl border bg-background p-5 shadow-sm transition hover:shadow-md"
                    >

                        <p className="text-sm text-muted-foreground">

                            {card.title}

                        </p>

                        <h2 className="mt-3 text-3xl font-bold">

                            {card.value}

                        </h2>

                    </article>

                ))

            }

        </section>

    );

}
