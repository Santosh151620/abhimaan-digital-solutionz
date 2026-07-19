'use client';

import Link from 'next/link';

import type { Ticket } from '@/types/crm/Tickets';

interface Props {
    tickets: Ticket[];
}

export default function TicketsTable({
    tickets,
}: Props) {

    if (tickets.length === 0) {
        return (
            <div className="rounded-xl border bg-card p-10 text-center text-muted-foreground">
                No tickets found.
            </div>
        );
    }

    const badgeClasses: Record<
        Ticket['status'],
        string
    > = {
        Open: 'bg-blue-100 text-blue-700',
        'In Progress': 'bg-yellow-100 text-yellow-700',
        Resolved: 'bg-green-100 text-green-700',
        Closed: 'bg-slate-200 text-slate-700',
    };

    const priorityClasses: Record<
        Ticket['priority'],
        string
    > = {
        Low: 'bg-slate-100 text-slate-700',
        Medium: 'bg-blue-100 text-blue-700',
        High: 'bg-orange-100 text-orange-700',
        Critical: 'bg-red-100 text-red-700',
    };

    return (

        <div className="overflow-x-auto rounded-xl border bg-card">

            <table className="min-w-full">

                <thead className="bg-muted/40">

                    <tr>

                        <th className="px-4 py-3 text-left">
                            Ticket
                        </th>

                        <th className="px-4 py-3 text-left">
                            Customer
                        </th>

                        <th className="px-4 py-3 text-left">
                            Priority
                        </th>

                        <th className="px-4 py-3 text-left">
                            Status
                        </th>

                        <th className="px-4 py-3 text-left">
                            Assigned To
                        </th>

                        <th className="px-4 py-3 text-left">
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {tickets.map((ticket) => (

                        <tr
                            key={ticket.id}
                            className="border-t hover:bg-muted/20"
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
                                {ticket.companyId || '-'}
                            </td>

                            <td className="px-4 py-3">

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${priorityClasses[ticket.priority]}`}
                                >
                                    {ticket.priority}
                                </span>

                            </td>

                            <td className="px-4 py-3">

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClasses[ticket.status]}`}
                                >
                                    {ticket.status}
                                </span>

                            </td>

                            <td className="px-4 py-3">
                                {ticket.assignedTo || '-'}
                            </td>

                            <td className="px-4 py-3">

                                <div className="flex gap-2">

                                    <Link
                                        href={`/crm/tickets/${ticket.id}`}
                                        className="rounded border px-3 py-1 text-sm hover:bg-muted"
                                    >
                                        View
                                    </Link>

                                    <Link
                                        href={`/crm/tickets/${ticket.id}/edit`}
                                        className="rounded border px-3 py-1 text-sm hover:bg-muted"
                                    >
                                        Edit
                                    </Link>

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}