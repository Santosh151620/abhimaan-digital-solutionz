'use server';

import { TicketsServiceInstance } from '@/services/crm/TicketsService';
import type {
    Ticket,
    TicketStatus,
} from '@/types/crm/Tickets';

export async function getTickets() {
    return TicketsServiceInstance.list();
}

export async function getArchivedTickets() {
    return TicketsServiceInstance.listArchived();
}

export async function createTicket(
    data: Partial<Ticket>
) {
    return TicketsServiceInstance.create(data);
}

export async function updateTicket(
    id: string,
    data: Partial<Ticket>
) {
    return TicketsServiceInstance.update(id, data);
}

export async function getTicket(
    id: string
) {
    return TicketsServiceInstance.findById(id);
}

export async function updateTicketStatus(
    id: string,
    status: TicketStatus
) {
    return TicketsServiceInstance.updateStatus(
        id,
        status
    );
}