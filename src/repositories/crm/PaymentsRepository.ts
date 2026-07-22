import type {
    Payment,
    PaymentStatus,
} from '@/types/crm/Payments';

class PaymentsRepository {

    private payments =
        new Map<string, Payment>();

    list() {

        return Array.from(
            this.payments.values()
        ).filter(
            payment => !payment.archived
        );

    }

    listArchived() {

        return Array.from(
            this.payments.values()
        ).filter(
            payment => payment.archived
        );

    }

    details(
        id: string,
    ) {

        return this.payments.get(id) ?? null;

    }

    create(
        data: Partial<Payment>,
    ): Payment {

        const now =
            new Date().toISOString();

        const payment: Payment = {

            id:
                crypto.randomUUID(),

            paymentNumber:
                data.paymentNumber ??
                `PAY-${Date.now()}`,

            invoiceId:
                data.invoiceId,

            companyId:
                data.companyId,

            customerName:
                data.customerName ?? '',

            description:
                data.description,

            amount:
                data.amount ?? 0,

            paidAmount:
                data.paidAmount ?? 0,

            balanceAmount:
                data.balanceAmount ??
                (
                    (data.amount ?? 0)
                    -
                    (data.paidAmount ?? 0)
                ),

            currency:
                data.currency ?? 'INR',

            paymentMethod:
                data.paymentMethod ??
                'Bank Transfer',

            status:
                data.status ??
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

    update(
        id: string,
        data: Partial<Payment>,
    ) {

        const existing =
            this.payments.get(id);

        if (!existing) {

            return null;

        }

        const updated: Payment = {

            ...existing,

            ...data,

            balanceAmount:
                (
                    data.amount ??
                    existing.amount
                )
                -
                (
                    data.paidAmount ??
                    existing.paidAmount
                ),

            updatedAt:
                new Date().toISOString(),

        };

        this.payments.set(
            id,
            updated,
        );

        return updated;

    }

    updateStatus(
        id: string,
        status: PaymentStatus,
    ) {

        return this.update(
            id,
            {
                status,
            },
        );

    }

    delete(
        id: string,
    ) {

        const payment =
            this.payments.get(id);

        if (!payment) {

            return false;

        }

        payment.archived =
            true;

        payment.updatedAt =
            new Date().toISOString();

        this.payments.set(
            id,
            payment,
        );

        return true;

    }

    restore(
        id: string,
    ) {

        const payment =
            this.payments.get(id);

        if (!payment) {

            return false;

        }

        payment.archived =
            false;

        payment.updatedAt =
            new Date().toISOString();

        this.payments.set(
            id,
            payment,
        );

        return true;

    }

    summary() {

        const payments =
            this.list();

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

        return {

            total:
                payments.length,

            pending:
                payments.filter(
                    p =>
                        p.status ===
                        'Pending',
                ).length,

            paid:
                payments.filter(
                    p =>
                        p.status ===
                        'Paid',
                ).length,

            overdue:
                payments.filter(
                    p =>
                        p.status ===
                        'Overdue',
                ).length,

            cancelled:
                payments.filter(
                    p =>
                        p.status ===
                        'Cancelled',
                ).length,

            refunded:
                payments.filter(
                    p =>
                        p.status ===
                        'Refunded',
                ).length,

            totalAmount,

            totalReceived,

            totalOutstanding:
                totalAmount -
                totalReceived,

        };

    }

}

export const
    PaymentsRepositoryInstance =
        new PaymentsRepository();