import {
    notFound,
    redirect,
} from 'next/navigation';

import type {
    TicketPriority,
    TicketStatus,
} from '@/types/crm/Tickets';

import TicketsForm from '@/components/crm/tickets/TicketsForm';

import {
    getTicket,
    updateTicket,
} from '../../actions';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditTicketPage({
    params,
}: Props) {

    const { id } =
        await params;

    const ticket =
        await getTicket(id);

    if (!ticket) {
        notFound();
    }

    const currentTicket = ticket;

    async function submit(
        formData: FormData
    ) {
        'use server';

        await updateTicket(
            id,
            {

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

                status: String(
                    formData.get('status') ??
                    currentTicket.status
                ) as TicketStatus,

                priority: String(
                    formData.get('priority') ??
                    currentTicket.priority
                ) as TicketPriority,
            }
        );

        redirect(
            `/crm/tickets/${id}`
        );

    }

    return (

        <div className="space-y-6 p-6">

            <h1 className="text-3xl font-bold">
                Edit Ticket
            </h1>

            <TicketsForm
                initialData={currentTicket}
                action={submit}
            />

        </div>

    );

}