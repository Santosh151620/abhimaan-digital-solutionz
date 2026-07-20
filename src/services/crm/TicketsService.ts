import { TicketsRepositoryInstance } from '@/repositories/crm/TicketsRepository';

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

    findById(id: string) {
        return TicketsRepositoryInstance.findById(id);
    }

    details(id: string) {
        return this.findById(id);
    }

    create(data: Partial<Ticket>) {
        return TicketsRepositoryInstance.create(data);
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
        return this.update(id, {
            status,
        });
    }

}

export const TicketsServiceInstance =
    new TicketsService();