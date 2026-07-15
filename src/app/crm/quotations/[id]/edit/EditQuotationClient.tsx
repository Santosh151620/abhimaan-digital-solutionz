'use client';

import { useRouter } from 'next/navigation';

import QuotationsForm from '@/components/crm/quotations/QuotationsForm';

import type { Quotation } from '@/types/crm/Quotations';

type Props = {
    quotation: Quotation;
    updateQuotation: (
        id: string,
        data: Partial<Quotation>,
    ) => Promise<Quotation | null>;
};

export default function EditQuotationClient({
    quotation,
    updateQuotation,
}: Props) {

    const router = useRouter();

    async function submit(
        formData: FormData,
    ) {

        await updateQuotation(
            quotation.id,
            {
                title: String(formData.get('title') ?? ''),
                customerName: String(
                    formData.get('customerName') ?? '',
                ),
                amount: Number(
                    formData.get('amount') ?? 0,
                ),
                currency: String(
                    formData.get('currency') ?? 'INR',
                ),
                status:
                    formData.get('status') as Quotation['status'],
                validUntil: String(
                    formData.get('validUntil') ?? '',
                ),
            },
        );

        router.push(
            `/crm/quotations/${quotation.id}`,
        );

        router.refresh();

    }

    return (
        <QuotationsForm
            quotation={quotation}
            action={submit}
        />
    );

}