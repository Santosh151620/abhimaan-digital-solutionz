import { redirect } from 'next/navigation';

import TicketsForm from '@/components/crm/tickets/TicketsForm';

import { createTicket } from '../actions';

import type {
    TicketPriority,
    TicketStatus,
} from '@/types/crm/Tickets';

export default function NewTicketPage() {

    async function submit(
        formData: FormData
    ) {
        'use server';

        const ticket =
            await createTicket({

                ticketNumber: String(
                    formData.get('ticketNumber') ?? ''
                ),

                subject: String(
                    formData.get('subject') ?? ''
                ),

                companyId: String(
                    formData.get('companyId') ?? ''
                ),

                description: String(
                    formData.get('description') ?? ''
                ),

                status:
                    (formData.get('status') as TicketStatus)
                    ?? 'Open',

                priority:
                    (formData.get('priority') as TicketPriority)
                    ?? 'Medium',

            });

        redirect(
            `/crm/tickets/${ticket.id}`
        );
    }

    return (

        <div className="space-y-6 p-6">

            <h1 className="text-3xl font-bold">
                New Ticket
            </h1>

            <TicketsForm
                action={submit}
            />

        </div>

    );

}