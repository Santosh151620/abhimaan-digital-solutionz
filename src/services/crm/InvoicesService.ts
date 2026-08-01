import {
    createClient,
} from '@/lib/supabase/server';

import {
    createInvoicesRepository,
} from '@/repositories/crm/InvoicesRepository';

import type {
    Invoice,
    InvoiceSearchFilters,
    InvoiceStatus,
    InvoiceSummary,
} from '@/types/crm/Invoices';


class InvoicesService {


    private async repository() {

        const supabase =
            await createClient();


        return createInvoicesRepository(
            supabase,
        );

    }



    async list(): Promise<Invoice[]> {

        return (
            await this.repository()
        ).list();

    }



    async listArchived(): Promise<Invoice[]> {

        return (
            await this.repository()
        ).listArchived();

    }



    async findById(
        id: string,
    ): Promise<Invoice | null> {

        return (
            await this.repository()
        ).findById(
            id,
        );

    }



    async details(
        id: string,
    ): Promise<Invoice | null> {

        return this.findById(
            id,
        );

    }



    async create(
        data: Partial<Invoice>,
    ): Promise<Invoice> {

        return (
            await this.repository()
        ).create(
            data,
        );

    }



    async update(
        id: string,
        data: Partial<Invoice>,
    ): Promise<Invoice> {

        return (
            await this.repository()
        ).update(

            id,

            {
                ...data,

                entityType:
                    'Invoice',
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
): Promise<Invoice> {

    return (
        await this.repository()
    ).restore(
        id,
    );

}

    async updateStatus(
        id: string,
        status: InvoiceStatus,
    ): Promise<Invoice> {

        return (
            await this.repository()
        ).updateStatus(

            id,

            status,

        );

    }



    async search(
        filters?: InvoiceSearchFilters,
    ): Promise<Invoice[]> {

        return (
            await this.repository()
        ).search(
            filters,
        );

    }



    async summary(): Promise<
        InvoiceSummary & {
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
             * Backward compatibility
             * for existing dashboard consumers.
             */
            value:
                summary.totalValue,

        };

    }

}



export const invoicesService =
    new InvoicesService();



/**
 * Backward compatibility alias.
 */
export const InvoicesServiceInstance =
    invoicesService;



export const invoiceService =
    invoicesService;