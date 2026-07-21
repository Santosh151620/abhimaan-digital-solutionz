import Link from 'next/link';

import {
    getArchivedTickets,
} from '../actions';

export default async function ArchivedTicketsPage() {

    const tickets =
        await getArchivedTickets();

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-semibold">
                        Archived Tickets
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        View archived support tickets.
                    </p>

                </div>

                <Link
                    href="/crm/tickets"
                    className="rounded-lg border px-4 py-2"
                >
                    Back to Tickets
                </Link>

            </div>

            <div className="rounded-lg border overflow-hidden">

                <table className="min-w-full">

                    <thead className="bg-muted/40">

                        <tr>

                            <th className="px-4 py-3 text-left">
                                Ticket
                            </th>

                            <th className="px-4 py-3 text-left">
                                Status
                            </th>

                            <th className="px-4 py-3 text-left">
                                Priority
                            </th>

                            <th className="px-4 py-3 text-left">
                                Assigned
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {tickets.map(ticket => (

                            <tr
                                key={ticket.id}
                                className="border-t"
                            >

                                <td className="px-4 py-3">

                                    <div className="font-medium">
                                        {ticket.subject}
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                        {ticket.ticketNumber}
                                    </div>

                                </td>

                                <td className="px-4 py-3">
                                    {ticket.status}
                                </td>

                                <td className="px-4 py-3">
                                    {ticket.priority}
                                </td>

                                <td className="px-4 py-3">
                                    {ticket.assignedTo ?? '-'}
                                </td>

                            </tr>

                        ))}

                        {tickets.length === 0 && (

                            <tr>

                                <td
                                    colSpan={4}
                                    className="p-8 text-center text-muted-foreground"
                                >
                                    No archived tickets.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}