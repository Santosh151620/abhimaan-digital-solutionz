import {
    TicketsRepositoryInstance,
} from '@/repositories/crm/TicketsRepository';


import type {
    Ticket,
    TicketSearchFilters,
    TicketStatus,
} from '@/types/crm/Tickets';



export class TicketsService {


    list(): Ticket[] {

        return TicketsRepositoryInstance.list();

    }



    listArchived(): Ticket[] {

        return TicketsRepositoryInstance.listArchived();

    }



    findById(
        id: string,
    ): Ticket | null {

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
        filters?: TicketSearchFilters,
    ): Ticket[] {

        return TicketsRepositoryInstance.search(
            filters,
        );

    }



    create(
        data: Partial<Ticket>,
    ): Ticket {

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



/**
 * Backward compatible export.
 * Existing API/actions depend on this.
 */
export const TicketsServiceInstance =
    new TicketsService();



/**
 * Legacy compatibility export.
 */
export const ticketsService =
    TicketsServiceInstance;
