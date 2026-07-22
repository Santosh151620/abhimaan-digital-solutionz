'use client';

import type { Contact } from '@/types/crm/Contacts';

interface Props {
    contacts: Contact[];
}

export default function ContactsSummary({
    contacts,
}: Props) {

    const totalContacts = contacts.length;

    const activeContacts =
        contacts.filter(
            contact => contact.status === 'ACTIVE'
        ).length;

    const inactiveContacts =
        contacts.filter(
            contact => contact.status === 'INACTIVE'
        ).length;

    const primaryContacts =
        contacts.filter(
            contact => Boolean(contact.companyId)
        ).length;


    const cards = [
        {
            title: 'Total Contacts',
            value: totalContacts,
        },
        {
            title: 'Active',
            value: activeContacts,
        },
        {
            title: 'Inactive',
            value: inactiveContacts,
        },
        {
            title: 'Primary Contacts',
            value: primaryContacts,
        },
    ];


    return (

        <div className="grid gap-4 md:grid-cols-4">

            {cards.map(card => (

                <div
                    key={card.title}
                    className="rounded-xl border bg-card p-5"
                >

                    <div className="text-sm text-muted-foreground">
                        {card.title}
                    </div>

                    <div className="mt-2 text-3xl font-bold">
                        {card.value}
                    </div>

                </div>

            ))}

        </div>

    );

}