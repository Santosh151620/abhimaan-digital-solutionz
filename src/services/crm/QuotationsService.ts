import {
    createClient,
} from '@/lib/supabase/server';

import {
    createQuotationsRepository,
} from '@/repositories/crm/QuotationsRepository';

import type {
    Quotation,
    QuotationSearchFilters,
    QuotationStatus,
    QuotationSummary,
} from '@/types/crm/Quotations';



class QuotationsService {


    private async repository() {

        const supabase =
            await createClient();

        return createQuotationsRepository(
            supabase,
        );

    }




    async list() {

        return (await this.repository()).list();

    }




    async listArchived() {

        return (await this.repository()).listArchived();

    }




    async findById(
        id: string,
    ) {

        return (await this.repository()).findById(
            id,
        );

    }




    async details(
        id: string,
    ) {

        return this.findById(
            id,
        );

    }




    async create(
        data: Partial<Quotation>,
    ) {

        return (await this.repository()).create(
            data,
        );

    }




    async update(
        id: string,
        data: Partial<Quotation>,
    ) {

        return (await this.repository()).update(
            id,
            data,
        );

    }




    async delete(
        id: string,
    ) {

        return (await this.repository()).delete(
            id,
        );

    }




    async restore(
        id: string,
    ) {

        return (await this.repository()).restore(
            id,
        );

    }




    async updateStatus(
        id: string,
        status: QuotationStatus,
    ) {

        return (await this.repository()).updateStatus(
            id,
            status,
        );

    }




    async search(
        filters?: QuotationSearchFilters,
    ) {

        return (await this.repository()).search(
            filters,
        );

    }




    async summary() {

        const summary: QuotationSummary =
            await (await this.repository()).summary();

        return {

            ...summary,

            // Backward compatibility
            value:
                summary.totalValue,

        };

    }

}



export const quotationsService =
    new QuotationsService();



/**
 * Backward compatibility alias.
 */
export const QuotationsServiceInstance =
    quotationsService;
