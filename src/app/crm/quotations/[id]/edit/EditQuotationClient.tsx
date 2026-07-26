'use client';

import {
    useRouter,
} from 'next/navigation';

import QuotationsForm from '@/components/crm/quotations/QuotationsForm';

import type {
    Quotation,
    QuotationStatus,
} from '@/types/crm/Quotations';



type Props = {

    quotation: Quotation;

    updateQuotation:
        (
            id: string,
            data: Partial<Quotation>,
        ) => Promise<Quotation | null>;

};



export default function EditQuotationClient({

    quotation,

    updateQuotation,

}: Props) {


    const router =
        useRouter();



    async function submit(
        formData: FormData,
    ) {


        const statusValue =
            formData.get('status');


        const status: QuotationStatus =
            typeof statusValue === 'string'
                ? statusValue as QuotationStatus
                : 'Draft';



        await updateQuotation(

            quotation.id,

            {

                title:
                    String(
                        formData.get('title') ?? '',
                    ),


                customerName:
                    String(
                        formData.get('customerName') ?? '',
                    ),


                companyId:
                    String(
                        formData.get('companyId') ??
                        quotation.companyId,
                    ),


                opportunityId:
                    String(
                        formData.get('opportunityId') ??
                        '',
                    )
                    ||
                    undefined,


                amount:
                    Number(
                        formData.get('amount') ?? 0,
                    ),


                currency:
                    String(
                        formData.get('currency') ?? 'INR',
                    ),


                status,


                validUntil:
                    String(
                        formData.get('validUntil') ?? '',
                    ),


                tax:
                    Number(
                        formData.get('tax') ?? 0,
                    ),


                discount:
                    Number(
                        formData.get('discount') ?? 0,
                    ),


                notes:
                    String(
                        formData.get('notes') ?? '',
                    )
                    ||
                    undefined,

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