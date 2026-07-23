import Link from 'next/link';

import {
    getQuotationSummary,
} from '../actions';


export default async function QuotationsReportsPage() {

    const summary =
        await getQuotationSummary();


    return (

        <div className="space-y-8 p-6">


            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        Quotation Reports
                    </h1>

                    <p className="text-muted-foreground">
                        Revenue and quotation performance overview.
                    </p>

                </div>


                <Link
                    href="/crm/quotations"
                    className="rounded border px-4 py-2"
                >
                    Back to Quotations
                </Link>

            </div>


            <div className="grid gap-4 md:grid-cols-3">


                <div className="rounded-xl border p-5">
                    <p>Total Quotations</p>
                    <h2 className="text-2xl font-bold">
                        {summary.total}
                    </h2>
                </div>


                <div className="rounded-xl border p-5">
                    <p>Total Value</p>
                    <h2 className="text-2xl font-bold">
                        ₹ {summary.value}
                    </h2>
                </div>


                <div className="rounded-xl border p-5">
                    <p>Accepted</p>
                    <h2 className="text-2xl font-bold">
                        {summary.accepted}
                    </h2>
                </div>


            </div>


            <div className="grid gap-4 md:grid-cols-4">


                <div className="rounded border p-4">
                    Draft
                    <strong className="block text-xl">
                        {summary.draft}
                    </strong>
                </div>


                <div className="rounded border p-4">
                    Sent
                    <strong className="block text-xl">
                        {summary.sent}
                    </strong>
                </div>


                <div className="rounded border p-4">
                    Accepted
                    <strong className="block text-xl">
                        {summary.accepted}
                    </strong>
                </div>


                <div className="rounded border p-4">
                    Rejected
                    <strong className="block text-xl">
                        {summary.rejected}
                    </strong>
                </div>


            </div>


        </div>

    );

}
