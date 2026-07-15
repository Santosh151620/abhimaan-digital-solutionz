import Link from 'next/link';

import QuotationsSummary from '@/components/crm/quotations/QuotationsSummary';
import QuotationsTable from '@/components/crm/quotations/QuotationsTable';

import { listQuotations } from './actions';

export default async function QuotationsPage() {

    const quotations = await listQuotations();

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-bold">
                        Quotations
                    </h1>

                    <p className="text-sm text-gray-500">
                        Manage customer quotations.
                    </p>

                </div>

                <Link
                    href="/crm/quotations/new"
                    className="rounded-lg bg-black px-4 py-2 text-white"
                >
                    New Quotation
                </Link>

            </div>

            <QuotationsSummary quotations={quotations} />

            <QuotationsTable quotations={quotations} />

        </div>

    );

}




