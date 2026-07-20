import Link from 'next/link';

import QuotationsSummary from '@/components/crm/quotations/QuotationsSummary';
import QuotationsTable from '@/components/crm/quotations/QuotationsTable';

import { getQuotations } from './actions';

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

            <QuotationsTable
                quotations={quotations}
            />

        </div>

    );

}