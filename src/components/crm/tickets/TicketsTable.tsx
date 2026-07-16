'use client';

import type { Ticket } from '@/types/crm/Tickets';

interface Props {
    tickets: Ticket[];
    onEdit?: (ticket: Ticket) => void;
    onDelete?: (ticket: Ticket) => void;
}

export default function TicketsTable({
    tickets,
    onEdit,
    onDelete,
}: Props) {

    return (
        <div className="overflow-x-auto rounded-xl border bg-card">

            <table className="w-full text-sm">

                <thead className="border-b bg-muted/50">

                    <tr>

                        <th className="px-4 py-3 text-left font-medium">
                            Ticket Number
                        </th>

                        <th className="px-4 py-3 text-left font-medium">
                            Subject
                        </th>

                        <th className="px-4 py-3 text-left font-medium">
                            Customer
                        </th>

                        <th className="px-4 py-3 text-left font-medium">
                            Status
                        </th>

                        <th className="px-4 py-3 text-left font-medium">
                            Priority
                        </th>

                        <th className="px-4 py-3 text-left font-medium">
                            Actions
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {tickets.length === 0 ? (

                        <tr>

                            <td
                                colSpan={6}
                                className="px-4 py-8 text-center text-muted-foreground"
                            >
                                No tickets found.
                            </td>

                        </tr>

                    ) : (

                        tickets.map((ticket) => (

                            <tr
                                key={ticket.id}
                                className="border-b last:border-0"
                            >

                                <td className="px-4 py-3">
                                    {ticket.ticketNumber}
                                </td>


                                <td className="px-4 py-3 font-medium">
                                    {ticket.subject}
                                </td>


                                <td className="px-4 py-3">
                                    {ticket.companyId}
                                </td>


                                <td className="px-4 py-3">
                                    <span className="rounded-full border px-2 py-1 text-xs">
                                        {ticket.status}
                                    </span>
                                </td>


                                <td className="px-4 py-3">
                                    <span className="rounded-full border px-2 py-1 text-xs">
                                        {ticket.priority}
                                    </span>
                                </td>


                                <td className="px-4 py-3">

                                    <div className="flex gap-2">

                                        {onEdit && (

                                            <button
                                                type="button"
                                                onClick={() => onEdit(ticket)}
                                                className="rounded-md border px-3 py-1 text-xs"
                                            >
                                                Edit
                                            </button>

                                        )}


                                        {onDelete && (

                                            <button
                                                type="button"
                                                onClick={() => onDelete(ticket)}
                                                className="rounded-md border px-3 py-1 text-xs"
                                            >
                                                Delete
                                            </button>

                                        )}

                                    </div>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>
    );

}