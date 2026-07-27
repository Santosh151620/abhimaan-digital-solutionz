'use client';

import type {
    ContactsSummary as ContactsSummaryModel,
} from '@/types/crm/Contacts';

interface Props {

    summary: ContactsSummaryModel;

}

const cards = [

    {
        key: 'total',
        label: 'Total',
    },

    {
        key: 'active',
        label: 'Active',
    },

    {
        key: 'inactive',
        label: 'Inactive',
    },

    {
        key: 'leads',
        label: 'Leads',
    },

    {
        key: 'customers',
        label: 'Customers',
    },

    {
        key: 'archived',
        label: 'Archived',
    },

] as const;

export default function ContactsSummary({

    summary,

}: Props) {

    return (

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

            {

                cards.map(card => (

                    <div
                        key={card.key}
                        className="rounded-xl border bg-card p-5"
                    >

                        <div className="text-sm text-muted-foreground">

                            {card.label}

                        </div>

                        <div className="mt-2 text-3xl font-semibold">

                            {summary[card.key]}

                        </div>

                    </div>

                ))

            }

        </div>

    );

}
