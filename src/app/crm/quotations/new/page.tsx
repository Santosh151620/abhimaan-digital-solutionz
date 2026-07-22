import {
    redirect,
} from 'next/navigation';

import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';
import CRMHeader from '@/components/crm/shared/layout/CRMHeader';

import QuotationsForm from '@/components/crm/quotations/QuotationsForm';

import {
    createQuotation,
} from '../actions';

import type {
    QuotationStatus,
} from '@/types/crm/Quotations';


export default function NewQuotationPage() {


    async function submit(
        formData: FormData,
    ) {

        'use server';


        const statusValue =
            formData.get('status');


        const quotationStatus: QuotationStatus =
            typeof statusValue === 'string'
                ? statusValue as QuotationStatus
                : 'Draft';


        const quotation =
            await createQuotation({

                title:
                    String(
                        formData.get('title') ?? ''
                    ),

                customerName:
                    String(
                        formData.get('customerName') ?? ''
                    ),

                amount:
                    Number(
                        formData.get('amount') ?? 0
                    ),

                currency:
                    String(
                        formData.get('currency') ?? 'INR'
                    ),

                status:
                    quotationStatus,

                validUntil:
                    String(
                        formData.get('validUntil') ?? ''
                    ),

            });


        redirect(
            `/crm/quotations/${quotation.id}`
        );

    }


    return (

        <CRMPageLayout>

            <CRMHeader

                title="New Quotation"

                description="Create a new customer quotation."

                actions={[
                    {
                        label: "Back",
                        href: "/crm/quotations",
                    },
                ]}

            />


            <QuotationsForm

                action={submit}

            />


        </CRMPageLayout>

    );

}