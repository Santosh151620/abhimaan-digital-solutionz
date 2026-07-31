import {
    notFound,
    redirect,
} from 'next/navigation';

import CRMHeader from '@/components/crm/shared/layout/CRMHeader';
import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';

import QuotationsForm from '@/components/crm/quotations/QuotationsForm';

import {
    updateQuotation,
} from '../../actions';

import {
    QuotationsServiceInstance,
} from '@/services/crm/QuotationsService';

import type {
    Quotation,
} from '@/types/crm/Quotations';

interface Props {

    params: Promise<{
        id: string;
    }>;

}

export default async function EditQuotationPage({

    params,

}: Props) {

    const {
        id,
    } = await params;

    const quotation =
        await QuotationsServiceInstance.details(
            id,
        );

    if (!quotation) {

        notFound();

    }

    async function submit(
        values: Partial<Quotation>,
    ) {

        'use server';

        await updateQuotation(
            id,
            values,
        );

        redirect(
            `/crm/quotations/${id}`,
        );

    }

    return (

        <CRMPageLayout>

            <CRMHeader
                title="Edit Quotation"
                description="Update customer quotation details."
                actions={[
                    {
                        label: 'Back',
                        href: `/crm/quotations/${id}`,
                    },
                ]}
            />

            <QuotationsForm
                quotation={quotation}
                onSubmit={submit}
            />

        </CRMPageLayout>

    );

}