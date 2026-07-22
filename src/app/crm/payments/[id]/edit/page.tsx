import {
    notFound,
    redirect,
} from 'next/navigation';

import {
    PaymentsForm,
} from '@/components/crm/payments';

import {
    getPayment,
    updatePayment,
} from '../../actions';

import type {
    PaymentMethod,
    PaymentStatus,
} from '@/types/crm/Payments';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditPaymentPage({
    params,
}: Props) {

    const { id } =
        await params;

    const payment =
        await getPayment(id);

    if (!payment) {
        notFound();
    }

    const currentPayment =
        payment;

    async function submit(
        formData: FormData,
    ) {

        'use server';

        await updatePayment(
            id,
            {

                paymentNumber: String(
                    formData.get('paymentNumber') ?? '',
                ),

                customerName: String(
                    formData.get('customerName') ?? '',
                ),

                companyId: String(
                    formData.get('companyId') ?? '',
                ),

                invoiceId: String(
                    formData.get('invoiceId') ?? '',
                ),

                description: String(
                    formData.get('description') ?? '',
                ),

                amount: Number(
                    formData.get('amount') ?? 0,
                ),

                paidAmount: Number(
                    formData.get('paidAmount') ?? 0,
                ),

                currency: String(
                    formData.get('currency') ?? 'INR',
                ),

                paymentMethod: String(
                    formData.get('paymentMethod') ??
                    currentPayment.paymentMethod,
                ) as PaymentMethod,

                status: String(
                    formData.get('status') ??
                    currentPayment.status,
                ) as PaymentStatus,

                paymentDate: String(
                    formData.get('paymentDate') ?? '',
                ),

                dueDate: String(
                    formData.get('dueDate') ?? '',
                ),

                referenceNumber: String(
                    formData.get('referenceNumber') ?? '',
                ),

                notes: String(
                    formData.get('notes') ?? '',
                ),

            },
        );

        redirect(
            `/crm/payments/${id}`,
        );

    }

    return (

        <div className="space-y-6 p-6">

            <h1 className="text-3xl font-bold">
                Edit Payment
            </h1>

            <PaymentsForm
                initialData={currentPayment}
                action={submit}
            />

        </div>

    );

}