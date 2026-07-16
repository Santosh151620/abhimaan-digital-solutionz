'use client';

import type { Contact } from '@/types/crm/Contacts';

interface Props {
    contacts: Contact[];
}

export default function ContactsTable({
    contacts,
}: Props) {

    return (
        <div className="overflow-x-auto rounded-xl border">

            <table className="w-full text-sm">

                <thead className="border-b bg-muted">

                    <tr>

                        <th className="px-4 py-3 text-left">
                            Name
                        </th>

                        <th className="px-4 py-3 text-left">
                            Email
                        </th>

                        <th className="px-4 py-3 text-left">
                            Phone
                        </th>

                        <th className="px-4 py-3 text-left">
                            Company
                        </th>

                        <th className="px-4 py-3 text-left">
                            Status
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {contacts.map((contact) => (

                        <tr
                            key={contact.id}
                            className="border-b last:border-0"
                        >

                            <td className="px-4 py-3 font-medium">
                                {contact.firstName} {contact.lastName}
                            </td>


                            <td className="px-4 py-3">
                                {contact.email ?? '-'}
                            </td>


                            <td className="px-4 py-3">
                                {contact.phone ?? '-'}
                            </td>


                            <td className="px-4 py-3">
                                {contact.companyName ?? '-'}
                            </td>


                            <td className="px-4 py-3">
                                {contact.status}
                            </td>

                        </tr>

                    ))}


                    {contacts.length === 0 && (

                        <tr>

                            <td
                                colSpan={5}
                                className="px-4 py-8 text-center text-muted-foreground"
                            >
                                No contacts found.
                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

        </div>
    );
}