'use server';

import {
    ticketImportExportService,
} from '@/services/crm/TicketImportExportService';

export async function exportTicketsCSV() {
    return ticketImportExportService.exportCSV();
}

async function importTicketsCSV(
    csv: string,
) {
    return ticketImportExportService.importCSV(
        csv,
    );
}


