'use server';

import {
    TicketImportExportServiceInstance,
} from '@/services/crm/TicketImportExportService';

export async function exportTicketsCSV() {
    return TicketImportExportServiceInstance.exportCSV();
}

export async function importTicketsCSV(
    csv: string,
) {
    return TicketImportExportServiceInstance.importCSV(
        csv,
    );
}