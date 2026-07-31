'use client';

import { useRouter } from 'next/navigation';

import QuotationsForm from '@/components/crm/quotations/QuotationsForm';

import type {
    Quotation,
} from '@/types/crm/Quotations';

interface Props {

    quotation: Quotation;

    updateQuotation: (
        id: string,
        values: Partial<Quotation>,
    ) => Promise<unknown>;

}

export default function EditQuotationClient({

    quotation,

    updateQuotation,

}: Props) {

    const router = useRouter();

    async function handleSubmit(

        values: Partial<Quotation>,

    ) {

        await updateQuotation(

            quotation.id,

            values,

        );

        router.push(

            `/crm/quotations/${quotation.id}`,

        );

        router.refresh();

    }

    return (

        <QuotationsForm

            quotation={quotation}

            onSubmit={handleSubmit}

            onCancel={() => router.back()}

        />

    );

}