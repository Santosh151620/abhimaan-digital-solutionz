import {
    createClient,
} from '@/lib/supabase/server';


import {
    TicketsRepository,
} from '@/repositories/crm/TicketsRepository';


import type {
    Ticket,
    TicketSearchFilters,
    TicketStatus,
} from '@/types/crm/Tickets';



export class TicketsService {


    private async repository() {

        const supabase =
            await createClient();


        return new TicketsRepository(
            supabase,
        );

    }



    async list(): Promise<Ticket[]> {

        const repository =
            await this.repository();


        return repository.list();

    }



    async listArchived(): Promise<Ticket[]> {

        const repository =
            await this.repository();


        return repository.listArchived();

    }



    async findById(
        id:string,
    ):Promise<Ticket | null> {

        const repository =
            await this.repository();


        return repository.findById(
            id,
        );

    }



    async details(
        id:string,
    ) {

        return this.findById(
            id,
        );

    }



    async search(
        filters?:TicketSearchFilters,
    ):Promise<Ticket[]> {

        const repository =
            await this.repository();


        return repository.search(
            filters,
        );

    }



    async create(
        data:Partial<Ticket>,
    ):Promise<Ticket> {

        const repository =
            await this.repository();


        return repository.create(
            data,
        );

    }



    async update(
        id:string,
        data:Partial<Ticket>,
    ):Promise<Ticket> {

        const repository =
            await this.repository();


        return repository.update(
            id,
            data,
        );

    }



    async updateStatus(
        id:string,
        status:TicketStatus,
    ) {

        const repository =
            await this.repository();


        return repository.updateStatus(
            id,
            status,
        );

    }



    async delete(
        id:string,
    ) {

        const repository =
            await this.repository();


        return repository.delete(
            id,
        );

    }



    async restore(
        id:string,
    ) {

        const repository =
            await this.repository();


        return repository.restore(
            id,
        );

    }



    async summary() {

        const repository =
            await this.repository();


        return repository.summary();

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

