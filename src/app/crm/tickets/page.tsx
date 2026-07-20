import Link from 'next/link';

import TicketsSummary from '@/components/crm/tickets/TicketsSummary';
import TicketsTable from '@/components/crm/tickets/TicketsTable';

import { getTickets } from './actions';

export default async function TicketsPage() {

    const tickets =
        await getTickets();

    return (

        <div className="space-y-8 p-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        Tickets
                    </h1>

                    <p className="text-muted-foreground">
                        Manage customer support requests and resolutions.
                    </p>

                </div>

                <Link
                    href="/crm/tickets/new"
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                >
                    + New Ticket
                </Link>

            </div>

            <TicketsSummary
                tickets={tickets}
            />

            <TicketsTable
                tickets={tickets}
            />

        </div>

    );

}