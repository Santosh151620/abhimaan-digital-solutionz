import type {
    SupabaseClient,
} from '@supabase/supabase-js';

import {
    BaseRepository,
} from '@/lib/db/base-repository';

import type {
    Payment,
    PaymentSearchFilters,
    PaymentStatus,
    PaymentSummary,
} from '@/types/crm/Payments';



export class PaymentsRepository
    extends BaseRepository<Payment> {


    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            'payments',
        );

    }



    async list(): Promise<Payment[]> {


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
        ) as Payment[];

    }




    async listArchived(): Promise<Payment[]> {


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
        ) as Payment[];

    }





    async findById(
        id: string,
    ): Promise<Payment | null> {

        return super.findById(
            id,
        );

    }





    async details(
        id: string,
    ): Promise<Payment | null> {

        return this.findById(
            id,
        );

    }





    async create(
        data: Partial<Payment>,
    ): Promise<Payment> {


        const now =
            new Date()
                .toISOString();


        const amount =
            data.amount ??
            0;


        const paidAmount =
            data.paidAmount ??
            0;



        return super.create(

            {

                ...data,


                id:
                    data.id ??
                    crypto.randomUUID(),


                paymentNumber:
                    data.paymentNumber ??
                    `PAY-${Date.now()}`,


                customerName:
                    data.customerName ??
                    '',


                amount,


                paidAmount,


                balanceAmount:

                    Math.max(
                        amount -
                        paidAmount,
                        0,
                    ),


                currency:
                    data.currency ??
                    'INR',


                paymentMethod:
                    data.paymentMethod ??
                    'Bank Transfer',


                status:
                    data.status ??
                    'Pending',


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

        data: Partial<Payment>,

    ): Promise<Payment> {


        return super.update(

            id,

            {

                ...data,

                updatedAt:
                    new Date()
                        .toISOString(),

            },

        );

    }





    async updateStatus(
        id: string,

        status: PaymentStatus,

    ): Promise<Payment> {


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
    ): Promise<boolean> {

        try {

            await this.update(

                id,

                {

                    archived:
                        false,

                },

            );


            return true;

        } catch {

            return false;

        }

    }


    async search(
        filters?: PaymentSearchFilters,
    ): Promise<Payment[]> {


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



        if (filters?.invoiceId) {

            query =
                query.eq(
                    'invoice_id',
                    filters.invoiceId,
                );

        }



        if (filters?.paymentMethod) {

            query =
                query.eq(
                    'payment_method',
                    filters.paymentMethod,
                );

        }



        if (filters?.search) {


            query =
                query.or(

                    [

                        `payment_number.ilike.%${filters.search}%`,

                        `customer_name.ilike.%${filters.search}%`,

                        `reference_number.ilike.%${filters.search}%`,

                    ]
                        .join(','),

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
        ) as Payment[];

    }





    async summary(): Promise<PaymentSummary> {


        const active =
            await this.list();


        const archived =
            await this.listArchived();



        const totalAmount =
            active.reduce(

                (
                    sum,
                    item,
                ) =>
                    sum +
                    item.amount,

                0,

            );



        const totalReceived =
            active.reduce(

                (
                    sum,
                    item,
                ) =>
                    sum +
                    item.paidAmount,

                0,

            );



        return {


            total:
                active.length,


            archived:
                archived.length,


            pending:
                active.filter(
                    item =>
                        item.status === 'Pending',
                ).length,


            partiallyPaid:
                active.filter(
                    item =>
                        item.status === 'Partially Paid',
                ).length,


            paid:
                active.filter(
                    item =>
                        item.status === 'Paid',
                ).length,


            overdue:
                active.filter(
                    item =>
                        item.status === 'Overdue',
                ).length,


            cancelled:
                active.filter(
                    item =>
                        item.status === 'Cancelled',
                ).length,


            refunded:
                active.filter(
                    item =>
                        item.status === 'Refunded',
                ).length,


            totalAmount,


            totalReceived,


            totalOutstanding:

                Math.max(
                    totalAmount -
                    totalReceived,
                    0,
                ),


            averagePayment:

                active.length === 0

                    ? 0

                    :

                    Number(

                        (
                            totalAmount /
                            active.length
                        )
                            .toFixed(2),

                    ),



            collectionRate:

                totalAmount === 0

                    ? 0

                    :

                    Number(

                        (
                            (
                                totalReceived /
                                totalAmount
                            )
                            *
                            100
                        )
                            .toFixed(2),

                    ),

        };

    }

}





export function createPaymentsRepository(
    supabase: SupabaseClient,
) {

    return new PaymentsRepository(
        supabase,
    );

}



export const PaymentsRepositoryInstance =
    createPaymentsRepository;