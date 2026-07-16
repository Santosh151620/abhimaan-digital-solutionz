'use client';

import type { Ticket } from '@/types/crm/Tickets';

interface Props {
    tickets: Ticket[];
}

export default function TicketsSummary({
    tickets,
}: Props) {

    const totalTickets = tickets.length;

    const openTickets = tickets.filter(
        (ticket) => ticket.status === 'Open'
    ).length;

    const inProgressTickets = tickets.filter(
        (ticket) => ticket.status === 'In Progress'
    ).length;

    const resolvedTickets = tickets.filter(
        (ticket) => ticket.status === 'Resolved'
    ).length;

    const closedTickets = tickets.filter(
        (ticket) => ticket.status === 'Closed'
    ).length;

    const criticalTickets = tickets.filter(
        (ticket) => ticket.priority === 'Critical'
    ).length;


    return (

        <div className="grid gap-4 md:grid-cols-6">

            <div className="rounded-xl border bg-card p-5">
                <div className="text-sm text-muted-foreground">
                    Total
                </div>

                <div className="mt-2 text-3xl font-bold">
                    {totalTickets}
                </div>
            </div>


            <div className="rounded-xl border bg-card p-5">
                <div className="text-sm text-muted-foreground">
                    Open
                </div>

                <div className="mt-2 text-3xl font-bold text-blue-600">
                    {openTickets}
                </div>
            </div>


            <div className="rounded-xl border bg-card p-5">
                <div className="text-sm text-muted-foreground">
                    In Progress
                </div>

                <div className="mt-2 text-3xl font-bold text-yellow-600">
                    {inProgressTickets}
                </div>
            </div>


            <div className="rounded-xl border bg-card p-5">
                <div className="text-sm text-muted-foreground">
                    Resolved
                </div>

                <div className="mt-2 text-3xl font-bold text-green-600">
                    {resolvedTickets}
                </div>
            </div>


            <div className="rounded-xl border bg-card p-5">
                <div className="text-sm text-muted-foreground">
                    Closed
                </div>

                <div className="mt-2 text-3xl font-bold text-slate-600">
                    {closedTickets}
                </div>
            </div>


            <div className="rounded-xl border bg-card p-5">
                <div className="text-sm text-muted-foreground">
                    Critical
                </div>

                <div className="mt-2 text-3xl font-bold text-red-600">
                    {criticalTickets}
                </div>
            </div>

        </div>

    );

}