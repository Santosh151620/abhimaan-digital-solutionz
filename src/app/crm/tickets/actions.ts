'use server';

import { TicketsServiceInstance } from '@/services/crm/TicketsService';

import type {
    Ticket,
    TicketStatus,
} from '@/types/crm/Tickets';

export async function getTickets() {
    return TicketsServiceInstance.list();
}

async function searchTickets(
    filters?: {
        status?: TicketStatus;
        priority?: Ticket['priority'];
        search?: string;
    }
) {
    return TicketsServiceInstance.search(filters);
}

export async function getArchivedTickets() {
    return TicketsServiceInstance.listArchived();
}

export async function getTicket(
    id: string
) {
    return TicketsServiceInstance.findById(id);
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
    return TicketsServiceInstance.update(
        id,
        data
    );
}

async function deleteTicket(
    id: string
) {
    return TicketsServiceInstance.delete(id);
}

async function restoreTicket(
    id: string
) {
    return TicketsServiceInstance.restore(id);
}

async function updateTicketStatus(
    id: string,
    status: TicketStatus
) {
    return TicketsServiceInstance.updateStatus(
        id,
        status
    );
}

export async function getTicketsSummary() {
    return TicketsServiceInstance.summary();
}

