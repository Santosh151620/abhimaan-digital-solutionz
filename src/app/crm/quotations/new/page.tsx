import {
    redirect,
} from 'next/navigation';

import CRMHeader from '@/components/crm/shared/layout/CRMHeader';
import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';

import QuotationsForm from '@/components/crm/quotations/QuotationsForm';

import {
    createQuotation,
} from '../actions';

import type {
    Quotation,
} from '@/types/crm/Quotations';

export default function NewQuotationPage() {

    async function submit(
        values: Partial<Quotation>,
    ) {

        'use server';

        const quotation =
            await createQuotation(
                values,
            );

        redirect(
            `/crm/quotations/${quotation.id}`,
        );

    }

    return (

        <CRMPageLayout>

            <CRMHeader
                title="New Quotation"
                description="Create a new customer quotation."
                actions={[
                    {
                        label: 'Back',
                        href: '/crm/quotations',
                    },
                ]}
            />

            <QuotationsForm
                onSubmit={submit}
            />

        </CRMPageLayout>

    );

}