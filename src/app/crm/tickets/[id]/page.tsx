import Link from 'next/link';
import { notFound } from 'next/navigation';

import { TicketsServiceInstance } from '@/services/crm/TicketsService';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function TicketDetailsPage({
    params,
}: Props) {

    const { id } = await params;

    const ticket =
        await TicketsServiceInstance.findById(id);

    if (!ticket) {
        notFound();
    }

    return (

        <div className="space-y-6 p-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        {ticket.subject}
                    </h1>

                    <p className="text-muted-foreground">
                        {ticket.ticketNumber}
                    </p>

                </div>

                <Link
                    href={`/crm/tickets/${id}/edit`}
                    className="rounded-lg border px-4 py-2"
                >
                    Edit
                </Link>

            </div>

            <div className="rounded-xl border p-6 space-y-3">

                <p>
                    <strong>Subject:</strong> {ticket.subject}
                </p>

                <p>
                    <strong>Status:</strong> {ticket.status}
                </p>

                <p>
                    <strong>Priority:</strong> {ticket.priority}
                </p>

                <p>
                    <strong>Company:</strong> {ticket.companyId || '-'}
                </p>

                <p>
                    <strong>Assigned To:</strong> {ticket.assignedTo || '-'}
                </p>

                <p>
                    <strong>Description:</strong>
                </p>

                <p>
                    {ticket.description || '-'}
                </p>

            </div>

        </div>

    );

}