import TicketsForm from '@/components/crm/tickets/TicketsForm';
import TicketsSummary from '@/components/crm/tickets/TicketsSummary';
import TicketsTable from '@/components/crm/tickets/TicketsTable';
import { saveTicket } from '@/actions/crm/tickets';
import type { Ticket } from '@/types/crm/Tickets';

const tickets: Ticket[] = [];


export default async function TicketsPage() {

    return (

        <div className="space-y-8 p-6">

            <div>

                <h1 className="text-3xl font-bold">
                    Tickets
                </h1>

                <p className="text-muted-foreground">
                    Manage customer support requests and resolutions.
                </p>

            </div>


            <TicketsSummary
                tickets={tickets}
            />


            <TicketsForm
                action={saveTicket}
            />


            <TicketsTable
                tickets={tickets}
            />

        </div>

    );

}