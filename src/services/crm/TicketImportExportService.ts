import {
    TicketsServiceInstance,
} from '@/services/crm/TicketsService';

import type {
    TicketsService,
} from '@/services/crm/TicketsService';

import type {
    Ticket,
} from '@/types/crm/Tickets';



export class TicketImportExportService {


    constructor(
        private readonly ticketsService: TicketsService,
    ) {}



    async exportCSV(): Promise<string> {


        const tickets =
            await this.ticketsService.list();



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
                (ticket: Ticket) => [

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
                (row: string[]) =>
                    row.join(','),
            ),

        ].join('\n');

    }




    async importCSV(
        csv: string,
    ): Promise<Ticket[]> {


        const lines =
            csv
                .split('\n')
                .filter(
                    line =>
                        line.trim(),
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

            ] =
                line.split(',');



            const ticket =
                await this.ticketsService.create({

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

export const TicketImportExportServiceInstance =
    new TicketImportExportService(
        TicketsServiceInstance,
    );





/**
 * Legacy compatibility export.
 */
export const ticketImportExportService =
    TicketImportExportServiceInstance;

