import type {
    Payment,
    PaymentSearchFilters,
    PaymentStatus,
    PaymentSummary,
} from '@/types/crm/Payments';

class PaymentsRepository {

    private payments =
        new Map<string, Payment>();

    async list(): Promise<Payment[]> {

        return Array.from(
            this.payments.values(),
        )
            .filter(
                payment =>
                    !payment.archived,
            )
            .sort(
                (
                    a,
                    b,
                ) =>
                    b.createdAt.localeCompare(
                        a.createdAt,
                    ),
            );

    }

    async listArchived(): Promise<Payment[]> {

        return Array.from(
            this.payments.values(),
        )
            .filter(
                payment =>
                    payment.archived,
            )
            .sort(
                (
                    a,
                    b,
                ) =>
                    b.createdAt.localeCompare(
                        a.createdAt,
                    ),
            );

    }

    async details(
        id: string,
    ): Promise<Payment | null> {

        return (
            this.payments.get(id)
            ??
            null
        );

    }

    async findById(
        id: string,
    ): Promise<Payment | null> {

        return this.details(
            id,
        );

    }

    async search(
        filters?: PaymentSearchFilters,
    ): Promise<Payment[]> {

        let payments =
            await this.list();

        if (
            filters?.status
        ) {

            payments =
                payments.filter(
                    payment =>
                        payment.status ===
                        filters.status,
                );

        }

        if (
            filters?.companyId
        ) {

            payments =
                payments.filter(
                    payment =>
                        payment.companyId ===
                        filters.companyId,
                );

        }

        if (
            filters?.invoiceId
        ) {

            payments =
                payments.filter(
                    payment =>
                        payment.invoiceId ===
                        filters.invoiceId,
                );

        }

        if (
            filters?.paymentMethod
        ) {

            payments =
                payments.filter(
                    payment =>
                        payment.paymentMethod ===
                        filters.paymentMethod,
                );

        }

        if (
            filters?.search
        ) {

            const keyword =
                filters.search
                    .trim()
                    .toLowerCase();

            payments =
                payments.filter(
                    payment =>

                        payment.paymentNumber
                            .toLowerCase()
                            .includes(
                                keyword,
                            )

                        ||

                        payment.customerName
                            .toLowerCase()
                            .includes(
                                keyword,
                            )

                        ||

                        (
                            payment.referenceNumber
                            ??
                            ''
                        )
                            .toLowerCase()
                            .includes(
                                keyword,
                            )

                        ||

                        (
                            payment.description
                            ??
                            ''
                        )
                            .toLowerCase()
                            .includes(
                                keyword,
                            ),
                );

        }

        return payments;

    }

    async create(
        data: Partial<Payment>,
    ): Promise<Payment> {

        const now =
            new Date()
                .toISOString();

        const amount =
            data.amount
            ??
            0;

        const paidAmount =
            data.paidAmount
            ??
            0;

        const payment: Payment = {

            id:
                crypto.randomUUID(),

            paymentNumber:
                data.paymentNumber
                ??
                `PAY-${Date.now()}`,

            organizationId:
                data.organizationId,

            invoiceId:
                data.invoiceId,

            companyId:
                data.companyId,

            customerName:
                data.customerName
                ??
                '',

            description:
                data.description,

            amount,

            paidAmount,

            balanceAmount:
                Math.max(
                    amount -
                    paidAmount,
                    0,
                ),

            currency:
                data.currency
                ??
                'INR',

            paymentMethod:
                data.paymentMethod
                ??
                'Bank Transfer',

            status:
                data.status
                ??
                'Pending',

            paymentDate:
                data.paymentDate,

            dueDate:
                data.dueDate,

            referenceNumber:
                data.referenceNumber,

            notes:
                data.notes,

            archived:
                false,

            createdAt:
                now,

            updatedAt:
                now,

        };

        this.payments.set(
            payment.id,
            payment,
        );

        return payment;

    }
        async update(
        id: string,
        data: Partial<Payment>,
    ): Promise<Payment | null> {

        const existing =
            this.payments.get(
                id,
            );

        if (
            !existing
        ) {

            return null;

        }

        const amount =
            data.amount
            ??
            existing.amount;

        const paidAmount =
            data.paidAmount
            ??
            existing.paidAmount;

        const updated: Payment = {

            ...existing,

            ...data,

            amount,

            paidAmount,

            balanceAmount:
                Math.max(
                    amount -
                    paidAmount,
                    0,
                ),

            updatedAt:
                new Date()
                    .toISOString(),

        };

        this.payments.set(
            id,
            updated,
        );

        return updated;

    }

    async updateStatus(
        id: string,
        status: PaymentStatus,
    ): Promise<Payment | null> {

        return this.update(
            id,
            {
                status,
            },
        );

    }

    async delete(
        id: string,
    ): Promise<boolean> {

        const payment =
            this.payments.get(
                id,
            );

        if (
            !payment
        ) {

            return false;

        }

        payment.archived =
            true;

        payment.updatedAt =
            new Date()
                .toISOString();

        this.payments.set(
            id,
            payment,
        );

        return true;

    }

    async restore(
        id: string,
    ): Promise<boolean> {

        const payment =
            this.payments.get(
                id,
            );

        if (
            !payment
        ) {

            return false;

        }

        payment.archived =
            false;

        payment.updatedAt =
            new Date()
                .toISOString();

        this.payments.set(
            id,
            payment,
        );

        return true;

    }

    async summary(): Promise<PaymentSummary> {

        const payments =
            await this.list();

        const totalAmount =
            payments.reduce(
                (
                    sum,
                    payment,
                ) =>
                    sum +
                    payment.amount,
                0,
            );

        const totalReceived =
            payments.reduce(
                (
                    sum,
                    payment,
                ) =>
                    sum +
                    payment.paidAmount,
                0,
            );

        const totalOutstanding =
            payments.reduce(
                (
                    sum,
                    payment,
                ) =>
                    sum +
                    payment.balanceAmount,
                0,
            );

        return {

    total:
        payments.length,

    pending:
        payments.filter(
            payment =>
                payment.status ===
                'Pending',
        ).length,

    paid:
        payments.filter(
            payment =>
                payment.status ===
                'Paid',
        ).length,

    partiallyPaid:
        payments.filter(
            payment =>
                payment.status ===
                'Partially Paid',
        ).length,

    overdue:
        payments.filter(
            payment =>
                payment.status ===
                'Overdue',
        ).length,

    cancelled:
        payments.filter(
            payment =>
                payment.status ===
                'Cancelled',
        ).length,

    refunded:
        payments.filter(
            payment =>
                payment.status ===
                'Refunded',
        ).length,

    archived:
        (
            await this.listArchived()
        ).length,

    totalAmount,

    totalReceived,

    totalOutstanding,

    averagePayment:

        payments.length === 0

            ? 0

            : Number(

                (
                    totalAmount /
                    payments.length
                ).toFixed(
                    2,
                ),

            ),

    collectionRate:

        totalAmount === 0

            ? 0

            : Number(

                (
                    (
                        totalReceived /
                        totalAmount
                    ) * 100
                ).toFixed(
                    2,
                ),

            ),

};

    }

}

export const
    PaymentsRepositoryInstance =
        new PaymentsRepository();

