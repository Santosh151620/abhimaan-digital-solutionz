import { redirect } from 'next/navigation';

import QuotationsForm from '@/components/crm/quotations/QuotationsForm';

import { createQuotation } from '../actions';

export default function NewQuotationPage() {

    async function submit(formData: FormData) {
        'use server';

        const quotation = await createQuotation({
            title: String(formData.get('title') ?? ''),
            customerName: String(formData.get('customerName') ?? ''),
            amount: Number(formData.get('amount') ?? 0),
            currency: String(formData.get('currency') ?? 'INR'),
            status:
                (formData.get('status') as import('@/types/crm/Quotations').QuotationStatus)
                ?? 'Draft',
            validUntil: String(formData.get('validUntil') ?? ''),
        });

        redirect(`/crm/quotations/${quotation.id}`);
    }

    return (

        <div className="space-y-6">

            <h1 className="text-2xl font-bold">
                New Quotation
            </h1>

            <QuotationsForm
                action={submit}
            />

        </div>

    );

}

