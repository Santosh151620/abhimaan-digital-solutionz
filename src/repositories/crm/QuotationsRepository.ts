import type {
    SupabaseClient,
} from '@supabase/supabase-js';

import {
    BaseRepository,
} from '@/lib/db/base-repository';

import type {
    Quotation,
    QuotationStatus,
    QuotationSearchFilters,
    QuotationSummary,
} from '@/types/crm/Quotations';



class QuotationsRepository
    extends BaseRepository<Quotation> {


    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            'quotations',
        );

    }




    async list(): Promise<Quotation[]> {


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
        ) as Quotation[];

    }




    async listArchived(): Promise<Quotation[]> {


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
        ) as Quotation[];

    }




    async findById(
        id: string,
    ): Promise<Quotation | null> {


        return super.findById(
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


        const items =
            data.items ??
            [];



        const subtotal =
            data.subtotal ??
            items.reduce(

                (
                    sum,
                    item,
                ) =>

                    sum +
                    (
                        item.quantity *
                        item.unitPrice
                    ),

                0,

            );



        const tax =
            data.tax ??
            0;



        const discount =
            data.discount ??
            0;



        const total =
            data.total ??
            (
                subtotal +
                tax -
                discount
            );



        const now =
            new Date()
                .toISOString();



        return super.create(

            {

                ...data,


                id:
                    data.id ??
                    crypto.randomUUID(),


                entityType:
                    'Quotation',


                quotationNumber:
                    data.quotationNumber ??
                    `QT-${Date.now()}`,


                title:
                    data.title ??
                    'Untitled Quotation',


                customerName:
                    data.customerName ??
                    '',


                amount:
                    total,


                subtotal,


                tax,


                discount,


                total,


                status:
                    data.status ??
                    'Draft',


                issueDate:
                    data.issueDate ??
                    now.substring(
                        0,
                        10,
                    ),


                validUntil:
                    data.validUntil ??
                    now.substring(
                        0,
                        10,
                    ),


                currency:
                    data.currency ??
                    'INR',


                items,


                archived:
                    false,


                createdAt:
                    now,


                updatedAt:
                    now,

            },

        );

    }
        async update(
        id: string,
        data: Partial<Quotation>,
    ): Promise<Quotation> {


        return super.update(

            id,

            {

                ...data,

                entityType:
                    'Quotation',

                updatedAt:
                    new Date()
                        .toISOString(),

            },

        );

    }




    async updateStatus(
        id: string,
        status: QuotationStatus,
    ): Promise<Quotation> {


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
    ): Promise<Quotation> {


        return this.update(

            id,

            {

                archived:
                    false,

            },

        );

    }




    async search(
        filters?: QuotationSearchFilters,
    ): Promise<Quotation[]> {


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


const searchValue =
    (
        filters?.search ??
        filters?.keyword
    )
        ?.trim();



        if (filters?.status) {

            query =
                query.eq(
                    'status',
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



        if (filters?.opportunityId) {

            query =
                query.eq(
                    'opportunity_id',
                    filters.opportunityId,
                );

        }



        if (searchValue) {

            query =
                query.or(

                    [

                        `title.ilike.%${searchValue}%`,

                        `customer_name.ilike.%${searchValue}%`,

                        `quotation_number.ilike.%${searchValue}%`,

                    ].join(','),

                );

        }



        const {
            data,
            error,
        } =
            await query;



        if (error) {

            throw error;

        }



        return (
            data ??
            []
        ) as Quotation[];

    }
        async summary(): Promise<QuotationSummary> {


        const quotations =
            await this.list();



        const totalValue =
            quotations.reduce(

                (
                    sum,
                    quotation,
                ) =>

                    sum +
                    quotation.total,

                0,

            );



        return {

            total:
                quotations.length,


            draft:
                quotations.filter(
                    quotation =>
                        quotation.status ===
                        'Draft',
                ).length,


            sent:
                quotations.filter(
                    quotation =>
                        quotation.status ===
                        'Sent',
                ).length,


            accepted:
                quotations.filter(
                    quotation =>
                        quotation.status ===
                        'Accepted',
                ).length,


            rejected:
                quotations.filter(
                    quotation =>
                        quotation.status ===
                        'Rejected',
                ).length,


            totalValue,

        };

    }


}



/**
 * Factory
 */
export function createQuotationsRepository(
    supabase: SupabaseClient,
) {

    return new QuotationsRepository(
        supabase,
    );

}


/**
 * Standard export
 */
const QuotationsRepositoryInstance =
    createQuotationsRepository;