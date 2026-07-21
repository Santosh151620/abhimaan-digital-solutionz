import {
    TicketsServiceInstance,
} from '@/services/crm/TicketsService';

import type {
    Ticket,
} from '@/types/crm/Tickets';

class TicketImportExportService {

    exportCSV() {

        const tickets =
            TicketsServiceInstance.list();

        const headers = [

            'ticketNumber',

            'subject',

            'description',

            'status',

            'priority',

            'assignedTo',

        ];

        const rows =
            tickets.map(
                ticket => [

                    ticket.ticketNumber,

                    ticket.subject,

                    ticket.description ?? '',

                    ticket.status,

                    ticket.priority,

                    ticket.assignedTo ?? '',

                ],
            );

        return [

            headers.join(','),

            ...rows.map(
                row => row.join(','),
            ),

        ].join('\n');

    }

    importCSV(
        csv: string,
    ) {

        const lines =
            csv
                .split('\n')
                .filter(
                    line => line.trim(),
                );

        const created: Ticket[] = [];

        for (
            const line of lines.slice(1)
        ) {

            const [

                ticketNumber,

                subject,

                description,

                status,

                priority,

                assignedTo,

            ] = line.split(',');

            const ticket =
                TicketsServiceInstance.create({

                    ticketNumber,

                    subject,

                    description,

                    status:
                        status as Ticket['status'],

                    priority:
                        priority as Ticket['priority'],

                    assignedTo,

                });

            created.push(
                ticket,
            );

        }

        return created;

    }

}

export const
    TicketImportExportServiceInstance =
        new TicketImportExportService();