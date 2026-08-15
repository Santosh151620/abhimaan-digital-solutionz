'use server';

import { ticketsService } from '@/services/crm/TicketsService';

import type {
    Ticket,
    TicketStatus,
} from '@/types/crm/Tickets';

export async function getTickets() {
    return ticketsService.list();
}

async function searchTickets(
    filters?: {
        status?: TicketStatus;
        priority?: Ticket['priority'];
        search?: string;
    }
) {
    return ticketsService.search(filters);
}

export async function getArchivedTickets() {
    return ticketsService.listArchived();
}

export async function getTicket(
    id: string
) {
    return ticketsService.findById(id);
}

export async function createTicket(
    data: Partial<Ticket>
) {
    return ticketsService.create(data);
}

export async function updateTicket(
    id: string,
    data: Partial<Ticket>
) {
    return ticketsService.update(
        id,
        data
    );
}

async function deleteTicket(
    id: string
) {
    return ticketsService.delete(id);
}

async function restoreTicket(
    id: string
) {
    return ticketsService.restore(id);
}

async function updateTicketStatus(
    id: string,
    status: TicketStatus
) {
    return ticketsService.updateStatus(
        id,
        status
    );
}

export async function getTicketsSummary() {
    return ticketsService.summary();
}


