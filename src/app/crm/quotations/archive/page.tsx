import Link from 'next/link';

import {
    getArchivedQuotations,
} from '../actions';

import QuotationsTable from '@/components/crm/quotations/QuotationsTable';


export default async function QuotationsArchivePage() {

    const quotations =
        await getArchivedQuotations();


    return (

        <div className="space-y-8 p-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        Archived Quotations
                    </h1>

                    <p className="text-muted-foreground">
                        Restore or review archived quotations.
                    </p>

                </div>


                <Link
                    href="/crm/quotations"
                    className="rounded-lg border px-4 py-2"
                >
                    Back to Quotations
                </Link>

            </div>


            <QuotationsTable
                quotations={quotations}
            />

        </div>

    );

}