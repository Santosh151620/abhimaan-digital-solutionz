import {
    getTickets,
} from '../actions';

import type {
    Ticket,
    TicketStatus,
} from '@/types/crm/Tickets';

const columns: TicketStatus[] = [

    'Open',

    'In Progress',

    'Resolved',

    'Closed',

];

function groupTickets(
    tickets: Ticket[],
) {

    return columns.map(
        status => ({

            status,

            tickets:
                tickets.filter(
                    ticket =>
                        ticket.status === status,
                ),

        }),
    );

}

export default async function TicketsKanbanPage() {

    const tickets =
        await getTickets();

    const board =
        groupTickets(
            tickets,
        );

    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-2xl font-semibold">
                    Tickets Kanban
                </h1>

                <p className="text-sm text-muted-foreground">
                    Visual support workflow management.
                </p>

            </div>

            <div className="grid gap-4 xl:grid-cols-4">

                {
                    board.map(
                        column => (

                            <div
                                key={column.status}
                                className="rounded-lg border bg-muted/20"
                            >

                                <div className="border-b p-4">

                                    <h2 className="font-semibold">
                                        {column.status}
                                    </h2>

                                    <p className="text-sm text-muted-foreground">
                                        {column.tickets.length} tickets
                                    </p>

                                </div>

                                <div className="space-y-3 p-4">

                                    {
                                        column.tickets.map(
                                            ticket => (

                                                <div
                                                    key={ticket.id}
                                                    className="rounded-lg border bg-background p-4"
                                                >

                                                    <p className="font-medium">
                                                        {ticket.subject}
                                                    </p>

                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {ticket.ticketNumber}
                                                    </p>

                                                    <div className="mt-3 space-y-1 text-xs">

                                                        <div>
                                                            Priority:{' '}
                                                            {ticket.priority}
                                                        </div>

                                                        <div>
                                                            Assigned:{' '}
                                                            {
                                                                ticket.assignedTo ??
                                                                '-'
                                                            }
                                                        </div>

                                                    </div>

                                                </div>

                                            ),
                                        )
                                    }

                                    {
                                        column.tickets.length === 0 && (

                                            <div className="rounded border border-dashed p-4 text-center text-sm text-muted-foreground">
                                                Empty
                                            </div>

                                        )
                                    }

                                </div>

                            </div>

                        ),
                    )
                }

            </div>

        </div>

    );

}