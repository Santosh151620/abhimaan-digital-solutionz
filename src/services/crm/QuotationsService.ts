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




    async list(): Promise<Quotation[]> {


        return (
            await this.repository()
        ).list();

    }




    async listArchived(): Promise<Quotation[]> {


        return (
            await this.repository()
        ).listArchived();

    }




    async findById(
        id: string,
    ): Promise<Quotation | null> {


        return (
            await this.repository()
        ).findById(
            id,
        );

    }




    async details(
        id: string,
    ): Promise<Quotation | null> {


        return this.findById(
            id,
        );

    }




    async create(
        data: Partial<Quotation>,
    ): Promise<Quotation> {


        return (
            await this.repository()
        ).create(
            data,
        );

    }




    async update(
        id: string,

        data: Partial<Quotation>,

    ): Promise<Quotation> {


        return (
            await this.repository()
        ).update(

            id,

            {

                ...data,

                entityType:
                    'Quotation',

            },

        );

    }




    async delete(
        id: string,
    ): Promise<void> {


        await (
            await this.repository()
        ).delete(
            id,
        );

    }




    async restore(
        id: string,
    ): Promise<Quotation> {


        return (
            await this.repository()
        ).restore(
            id,
        );

    }




    async updateStatus(
        id: string,

        status: QuotationStatus,

    ): Promise<Quotation> {


        return (
            await this.repository()
        ).updateStatus(

            id,

            status,

        );

    }




    async search(
        filters?: QuotationSearchFilters,
    ): Promise<Quotation[]> {


        return (
            await this.repository()
        ).search(
            filters,
        );

    }




    async summary(): Promise<
        QuotationSummary & {
            value: number;
        }
    > {


        const summary =
            await (
                await this.repository()
            ).summary();



        return {

            ...summary,


            /**
             * Backward compatibility.
             */
            value:
                summary.totalValue,

        };

    }

}




const quotationsService =
    new QuotationsService();




/**
 * Backward compatibility alias.
 */
export const QuotationsServiceInstance =
    quotationsService;



const quotationService =
    quotationsService;