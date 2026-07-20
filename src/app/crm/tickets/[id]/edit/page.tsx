import { notFound } from 'next/navigation';

import TicketsForm from '@/components/crm/tickets/TicketsForm';

import { updateTicket } from '../../actions';
import { TicketsServiceInstance } from '@/services/crm/TicketsService';
import type { Ticket } from '@/types/crm/Tickets';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditTicketPage({
    params,
}: Props) {

    const { id } = await params;

    const ticket = await TicketsServiceInstance.details(id);

    if (!ticket) {
        notFound();
    }

    const currentTicket = ticket;

    async function submit(formData: FormData) {
        'use server';

        await updateTicket(currentTicket.id, {
            ticketNumber: String(
                formData.get('ticketNumber') ?? '',
            ),
            subject: String(
                formData.get('subject') ?? '',
            ),
            companyId: String(
                formData.get('companyId') ?? '',
            ),
            description: String(
                formData.get('description') ?? '',
            ),
            status: formData.get('status') as Ticket['status'],
            priority: formData.get('priority') as Ticket['priority'],
        });
    }

    return (
        <div className="space-y-8 p-6">

            <div>
                <h1 className="text-3xl font-bold">
                    Edit Ticket
                </h1>
            </div>

            <TicketsForm
                initialData={currentTicket}
                action={submit}
            />

        </div>
    );

}