'use client';

import type { Contact } from '@/types/crm/Contacts';

interface Props {
    contacts: Contact[];
}

export default function ContactsSummary({
    contacts,
}: Props) {

    const totalContacts = contacts.length;

    const activeContacts = contacts.filter(
        (contact) => contact.status === 'ACTIVE'
    ).length;

    const inactiveContacts = contacts.filter(
        (contact) => contact.status === 'INACTIVE'
    ).length;

    const primaryContacts = contacts.filter(
        (contact) => Boolean(contact.companyId)
    ).length;


    return (
        <div className="grid gap-4 md:grid-cols-4">

            <div className="rounded-xl border bg-card p-5">
                <div className="text-sm text-muted-foreground">
                    Total Contacts
                </div>

                <div className="mt-2 text-3xl font-bold">
                    {totalContacts}
                </div>
            </div>


            <div className="rounded-xl border bg-card p-5">
                <div className="text-sm text-muted-foreground">
                    Active
                </div>

                <div className="mt-2 text-3xl font-bold">
                    {activeContacts}
                </div>
            </div>


            <div className="rounded-xl border bg-card p-5">
                <div className="text-sm text-muted-foreground">
                    Inactive
                </div>

                <div className="mt-2 text-3xl font-bold">
                    {inactiveContacts}
                </div>
            </div>


            <div className="rounded-xl border bg-card p-5">
                <div className="text-sm text-muted-foreground">
                    Primary Contacts
                </div>

                <div className="mt-2 text-3xl font-bold">
                    {primaryContacts}
                </div>
            </div>

        </div>
    );
}