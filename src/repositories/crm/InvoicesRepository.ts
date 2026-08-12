import type {
    SupabaseClient,
} from '@supabase/supabase-js';

import {
    BaseRepository,
} from '@/lib/db/base-repository';

import type {
    Invoice,
    InvoiceSearchFilters,
    InvoiceSummary,
    InvoiceStatus,
} from '@/types/crm/Invoices';



class InvoicesRepository
    extends BaseRepository<Invoice> {



    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            'crm.invoices',
        );

    }





    async list(): Promise<Invoice[]> {


        const {
            data,
            error,
        } =
            await this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .eq(
                    'archived',
                    false,
                )
                .order(
                    'created_at',
                    {
                        ascending: false,
                    },
                );



        if (error) {

            throw error;

        }



        return (
            data ??
            []
        ) as Invoice[];

    }





    async listArchived(): Promise<Invoice[]> {


        const {
            data,
            error,
        } =
            await this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .eq(
                    'archived',
                    true,
                )
                .order(
                    'updated_at',
                    {
                        ascending: false,
                    },
                );



        if (error) {

            throw error;

        }



        return (
            data ??
            []
        ) as Invoice[];

    }





    async findById(
        id: string,
    ): Promise<Invoice | null> {

        return super.findById(
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

        const payload: Partial<Invoice> = {

            ...data,

            entityType:
                'Invoice',

            status:
                data.status
                ??
                'Draft',

            title:
                data.title
                ??
                'Invoice',

            currency:
                data.currency
                ??
                'INR',

            subtotal:
                data.subtotal
                ??
                0,

            tax:
                data.tax
                ??
                0,

            discount:
                data.discount
                ??
                0,

            total:
                data.total
                ??
                0,

            paidAmount:
                data.paidAmount
                ??
                0,

            balanceAmount:
                data.balanceAmount
                ??
                (
                    data.total
                    ??
                    0
                ),

            amount:
                data.amount
                ??
                (
                    data.total
                    ??
                    0
                ),

            value:
                data.value
                ??
                (
                    data.total
                    ??
                    0
                ),

            archived:
                false,

        };

        return super.create(

            {

                ...payload,

                invoice_status:
                    payload.status,

                currency_code:
                    payload.currency,

                subtotal_amount:
                    payload.subtotal,

                tax_amount:
                    payload.tax,

                discount_amount:
                    payload.discount,

                total_amount:
                    payload.total,

            } as Partial<Invoice>,

        );
    }





    async update(
        id: string,

        data: Partial<Invoice>,

    ): Promise<Invoice> {



        return super.update(

            id,

            {

                ...data,

                entityType:
                    'Invoice',

                invoice_status:
                    data.status,

                currency_code:
                    data.currency,

                subtotal_amount:
                    data.subtotal,

                tax_amount:
                    data.tax,

                discount_amount:
                    data.discount,

                total_amount:
                    data.total,

            } as Partial<Invoice>,

        );

    }





    async updateStatus(
        id: string,

        status: InvoiceStatus,

    ): Promise<Invoice> {



        return this.update(

            id,

            {

                status,

            },

        );

    }





    async delete(
        id: string,
    ): Promise<void> {


        await this.update(

            id,

            {

                archived:
                    true,

            },

        );

    }





    async restore(
        id: string,
    ): Promise<Invoice> {


        return this.update(

            id,

            {

                archived:
                    false,

            },

        );

    }





    async search(
        filters?: InvoiceSearchFilters,
    ): Promise<Invoice[]> {



        let query =
            this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .eq(
                    'archived',
                    false,
                );



        if (filters?.status) {


            query =
                query.eq(

                    'invoice_status',
                    filters.status,

                );

        }





        if (filters?.companyId) {


            query =
                query.eq(

                    'company_id',

                    filters.companyId,

                );

        }





        if (
            filters?.search &&
            filters.search.trim()
        ) {


            const keyword =
                filters.search.trim();



            query =
                query.or(

                    [

                        `invoice_number.ilike.%${keyword}%`,

                        `title.ilike.%${keyword}%`,

                    ].join(','),

                );

        }





        const {
            data,
            error,
        } =
            await query.order(

                'created_at',

                {

                    ascending:
                        false,

                },

            );



        if (error) {

            throw error;

        }



        return (
            data ??
            []
        ) as Invoice[];

    }





    async summary(): Promise<InvoiceSummary> {



        const invoices =
            await this.list();



        const archived =
            await this.listArchived();




        const totalValue =
            invoices.reduce(

                (
                    total,

                    invoice,

                ) =>

                    total +
                    (
                        invoice.total
                        ??
                        0
                    ),

                0,

            );




        const outstandingValue =
            invoices.reduce(

                (
                    total,

                    invoice,

                ) =>

                    total +
                    (
                        invoice.balanceAmount
                        ??
                        0
                    ),

                0,

            );




        return {


            total:
                invoices.length,



            draft:
                invoices.filter(
                    x =>
                        x.status === 'Draft',
                ).length,



            sent:
                invoices.filter(
                    x =>
                        x.status === 'Sent',
                ).length,



            paid:
                invoices.filter(
                    x =>
                        x.status === 'Paid',
                ).length,



            overdue:
                invoices.filter(
                    x =>
                        x.status === 'Overdue',
                ).length,



            cancelled:
                invoices.filter(
                    x =>
                        x.status === 'Cancelled',
                ).length,



            archived:
                archived.length,



            totalValue,



            outstandingValue,



            value:
                totalValue,

        };

    }

}




export function createInvoicesRepository(
    supabase: SupabaseClient,
) {


    return new InvoicesRepository(
        supabase,
    );

}