import TicketsForm from '@/components/crm/tickets/TicketsForm';
import TicketsSummary from '@/components/crm/tickets/TicketsSummary';
import TicketsTable from '@/components/crm/tickets/TicketsTable';
import { saveTicket } from '@/actions/crm/tickets';
import type { Ticket } from '@/types/crm/Tickets';

const tickets: Ticket[] = [];

async function saveTicket(formData: FormData) {
    'use server';

    const ticketNumber = String(
        formData.get('ticketNumber') ?? ''
    );

    const subject = String(
        formData.get('subject') ?? ''
    );

    const customerName = String(
        formData.get('customerName') ?? ''
    );

    const companyId = String(
        formData.get('companyId') ?? ''
    );

    const status = String(
        formData.get('status') ?? 'Open'
    );

    const priority = String(
        formData.get('priority') ?? 'Medium'
    );

    const description = String(
        formData.get('description') ?? ''
    );

    console.log({
        ticketNumber,
        subject,
        customerName,
        companyId,
        status,
        priority,
        description,
    });
}

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