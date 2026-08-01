'use client';

import Link from 'next/link';

import type {
    Contact,
} from '@/types/crm/Contacts';


interface Props {

    contacts: Contact[];

}



export default function ContactsTable({

    contacts,

}: Props) {


    if (contacts.length === 0) {

        return (

            <div className="rounded-xl border p-8 text-center text-muted-foreground">

                No contacts found.

            </div>

        );

    }



    return (

        <div className="overflow-x-auto rounded-xl border">

            <table className="w-full text-sm">

                <thead className="border-b bg-muted/40">

                    <tr>

                        <th className="px-4 py-3 text-left">
                            Contact
                        </th>


                        <th className="px-4 py-3 text-left">
                            Company
                        </th>


                        <th className="px-4 py-3 text-left">
                            Email
                        </th>


                        <th className="px-4 py-3 text-left">
                            Phone
                        </th>


                        <th className="px-4 py-3 text-left">
                            Designation
                        </th>


                        <th className="px-4 py-3 text-left">
                            Status
                        </th>


                        <th className="px-4 py-3 text-left">
                            Last Activity
                        </th>


                        <th className="px-4 py-3 text-right">
                            Actions
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {
                        contacts.map(contact => (

                            <tr
                                key={contact.id}
                                className="border-b hover:bg-muted/30"
                            >

                                <td className="px-4 py-3">

                                    <div className="font-medium">

                                        {
                                            contact.fullName
                                            ??
                                            `${contact.firstName} ${contact.lastName}`.trim()
                                        }

                                    </div>


                                    {
                                        contact.department && (

                                            <div className="text-xs text-muted-foreground">

                                                {contact.department}

                                            </div>

                                        )
                                    }

                                </td>



                                <td className="px-4 py-3">

                                    {contact.companyId ?? '-'}

                                </td>



                                <td className="px-4 py-3">

                                    {contact.email ?? '-'}

                                </td>



                                <td className="px-4 py-3">

                                    {contact.phone ?? contact.mobile ?? '-'}

                                </td>



                                <td className="px-4 py-3">

                                    {contact.designation ?? '-'}

                                </td>



                                <td className="px-4 py-3">

                                    {contact.status}

                                </td>



                                <td className="px-4 py-3">

                                    -

                                </td>



                                <td className="px-4 py-3 text-right">

                                    <div className="flex justify-end gap-2">

                                        <Link

                                            href={`/crm/contacts/${contact.id}`}

                                            className="rounded border px-3 py-1 text-sm"

                                        >

                                            View

                                        </Link>


                                        <Link

                                            href={`/crm/contacts/${contact.id}/edit`}

                                            className="rounded border px-3 py-1 text-sm"

                                        >

                                            Edit

                                        </Link>

                                    </div>

                                </td>


                            </tr>

                        ))
                    }

                </tbody>

            </table>

        </div>

    );

}