import { redirect } from 'next/navigation';

import {
    PaymentsForm,
} from '@/components/crm/payments';

import {
    createPayment,
} from '../actions';

import type {
    PaymentMethod,
    PaymentStatus,
} from '@/types/crm/Payments';

export default function NewPaymentPage() {

    async function submit(
        formData: FormData,
    ) {

        'use server';

        const payment =
            await createPayment({

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
                    formData.get('paymentMethod') ?? 'Bank Transfer',
                ) as PaymentMethod,

                status: String(
                    formData.get('status') ?? 'Pending',
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

            });

        redirect(
            `/crm/payments/${payment.id}`,
        );

    }

    return (

        <div className="space-y-6 p-6">

            <h1 className="text-3xl font-bold">
                New Payment
            </h1>

            <PaymentsForm
                action={submit}
            />

        </div>

    );

}