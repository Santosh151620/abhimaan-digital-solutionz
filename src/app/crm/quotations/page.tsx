import Link from 'next/link';
import QuotationsKanban from '@/components/crm/quotations/QuotationsKanban';
import QuotationsSummary from '@/components/crm/quotations/QuotationsSummary';
import QuotationsDataTable from '@/components/crm/quotations/QuotationsDataTable';
import { getQuotations } from './actions';
import QuotationsExport from '@/components/crm/quotations/QuotationsExport';
import QuotationsImport from '@/components/crm/quotations/QuotationsImport';

export default async function QuotationsPage() {

    const quotations =
        await getQuotations();

    return (

        <div className="space-y-8 p-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        Quotations
                    </h1>

                    <p className="text-muted-foreground">
                        Manage customer quotations.
                    </p>

                </div>

                <Link
                    href="/crm/quotations/new"
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                >
                    + New Quotation
                </Link>

            </div>

            <QuotationsSummary
                quotations={quotations}
            />

            <QuotationsDataTable
                quotations={quotations}
            />
            <QuotationsKanban
                quotations={quotations}
            />
            <QuotationsExport
    quotations={quotations}
/>
<QuotationsImport />
        </div>

    );

}