import Link from 'next/link';

import CRMPageLayout from '@/components/crm/shared/layout/CRMPageLayout';
import CRMHeader from '@/components/crm/shared/layout/CRMHeader';

import QuotationsKanban from '@/components/crm/quotations/QuotationsKanban';
import QuotationsSummary from '@/components/crm/quotations/QuotationsSummary';
import QuotationsDataTable from '@/components/crm/quotations/QuotationsDataTable';
import QuotationsExport from '@/components/crm/quotations/QuotationsExport';
import QuotationsImport from '@/components/crm/quotations/QuotationsImport';

import {
    getQuotations,
} from './actions';


export default async function QuotationsPage() {

    const quotations =
        await getQuotations();


    return (

        <CRMPageLayout>

            <CRMHeader
                title="Quotations"
                description="Manage customer quotations and sales proposals."
                actions={[
                    {
                        label: "New Quotation",
                        href: "/crm/quotations/new",
                    },
                ]}
            />


            <QuotationsSummary
                quotations={quotations}
            />


            <QuotationsDataTable
                quotations={quotations}
            />


            <QuotationsKanban
                quotations={quotations}
            />


            <div className="flex gap-3">

                <QuotationsExport
                    quotations={quotations}
                />

                <QuotationsImport />

            </div>


        </CRMPageLayout>

    );

}