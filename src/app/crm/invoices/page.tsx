import InvoicesForm from '@/components/crm/invoices/InvoicesForm';
import InvoicesSummary from '@/components/crm/invoices/InvoicesSummary';
import InvoicesTable from '@/components/crm/invoices/InvoicesTable';

import {
    listInvoices,
    saveInvoice,
} from './actions';

export default async function InvoicesPage() {

    const invoices = await listInvoices();

    return (
        <div className="space-y-8 p-6">

            <div>

                <h1 className="text-3xl font-bold">
                    Invoices
                </h1>

                <p className="text-muted-foreground">
                    Manage customer invoices and billing lifecycle.
                </p>

            </div>

            <InvoicesSummary
                invoices={invoices}
            />

            <InvoicesForm
                action={saveInvoice}
            />

            <InvoicesTable
                invoices={invoices}
            />

        </div>
    );

}