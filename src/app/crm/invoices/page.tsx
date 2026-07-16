import InvoicesForm from '@/components/crm/invoices/InvoicesForm';
import InvoicesSummary from '@/components/crm/invoices/InvoicesSummary';
import InvoicesTable from '@/components/crm/invoices/InvoicesTable';
import type { Invoice } from '@/types/crm/Invoices';

const invoices: Invoice[] = [];

async function saveInvoice(formData: FormData) {
    'use server';

    const invoiceNumber = String(
        formData.get('invoiceNumber') ?? ''
    );

    const customerName = String(
        formData.get('customerName') ?? ''
    );

    const companyId = String(
        formData.get('companyId') ?? ''
    );

    const status = String(
        formData.get('status') ?? 'Draft'
    );

    const amount = String(
        formData.get('amount') ?? '0'
    );

    const dueDate = String(
        formData.get('dueDate') ?? ''
    );

    console.log({
        invoiceNumber,
        customerName,
        companyId,
        status,
        amount,
        dueDate,
    });
}

export default async function InvoicesPage() {

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