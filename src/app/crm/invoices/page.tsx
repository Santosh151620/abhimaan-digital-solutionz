import Link from 'next/link';

import {
    listInvoices,
} from './actions';

import InvoicesSummary from '@/components/crm/invoices/InvoicesSummary';
import InvoicesTable from '@/components/crm/invoices/InvoicesTable';


export default async function InvoicesPage() {


    const invoices =
        await listInvoices();


    return (

        <div className="space-y-8 p-6">


            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        Invoices
                    </h1>

                    <p className="text-muted-foreground">
                        Manage customer invoices and billing lifecycle.
                    </p>

                </div>


                <Link
                    href="/crm/invoices/new"
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                >
                    + New Invoice
                </Link>


            </div>


            <InvoicesSummary
                invoices={invoices}
            />


            <InvoicesTable
                invoices={invoices}
            />


        </div>

    );

}