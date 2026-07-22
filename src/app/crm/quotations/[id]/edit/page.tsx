import {
    notFound,
    redirect,
} from 'next/navigation';

import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';
import CRMHeader from '@/components/crm/shared/layout/CRMHeader';

import QuotationsForm from '@/components/crm/quotations/QuotationsForm';

import {
    QuotationsServiceInstance,
} from '@/services/crm/QuotationsService';

import {
    updateQuotation,
} from '../../actions';


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
        await QuotationsServiceInstance.details(id);


    if (!quotation) {
        notFound();
    }


    async function submit(
        formData: FormData,
    ) {

        'use server';


        const statusValue =
            formData.get('status');


        await updateQuotation(
            id,
            {

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
                    typeof statusValue === 'string'
                        ? statusValue as import('@/types/crm/Quotations').QuotationStatus
                        : quotation?.status,

                validUntil:
                    String(
                        formData.get('validUntil') ?? ''
                    ),

            },
        );


        redirect(
            `/crm/quotations/${id}`
        );

    }


    return (

        <CRMPageLayout>


            <CRMHeader

                title="Edit Quotation"

                description="Update customer quotation details."

                actions={[
                    {
                        label: "Back",
                        href: `/crm/quotations/${id}`,
                    },
                ]}

            />


            <QuotationsForm

                quotation={quotation}

                action={submit}

            />


        </CRMPageLayout>

    );

}