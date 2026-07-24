import {
    TicketsRepositoryInstance,
} from '@/repositories/crm/TicketsRepository';

import type {
    Ticket,
    TicketStatus,
} from '@/types/crm/Tickets';

class TicketsService {

    list() {

        return TicketsRepositoryInstance.list();

    }

    listArchived() {

        return TicketsRepositoryInstance.listArchived();

    }

    findById(
        id: string,
    ) {

        return TicketsRepositoryInstance.findById(
            id,
        );

    }

    details(
        id: string,
    ) {

        return this.findById(
            id,
        );

    }

    search(
        filters?: {
            status?: TicketStatus;
            priority?: Ticket['priority'];
            search?: string;
        },
    ) {

        return TicketsRepositoryInstance.search(
            filters,
        );

    }

    create(
        data: Partial<Ticket>,
    ) {

        return TicketsRepositoryInstance.create(
            data,
        );

    }

    update(
        id: string,
        data: Partial<Ticket>,
    ) {

        return TicketsRepositoryInstance.update(
            id,
            data,
        );

    }

    updateStatus(
        id: string,
        status: TicketStatus,
    ) {

        return TicketsRepositoryInstance.updateStatus(
            id,
            status,
        );

    }

    delete(
        id: string,
    ) {

        return TicketsRepositoryInstance.delete(
            id,
        );

    }

    restore(
        id: string,
    ) {

        return TicketsRepositoryInstance.restore(
            id,
        );

    }

    summary() {

        return TicketsRepositoryInstance.summary();

    }

}

export async function createTicketsService() {

    return new TicketsService();

}

export const
    TicketsServiceInstance =
        new TicketsService();

export const
    TicketServiceInstance =
        TicketsServiceInstance;