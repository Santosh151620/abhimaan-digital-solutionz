'use client';

import type { Invoice } from '@/types/crm/Invoices';

interface Props {
    invoices: Invoice[];
}

export default function InvoicesSummary({
    invoices,
}: Props) {

    const totalInvoices =
        invoices.length;

    const draft =
        invoices.filter(
            (invoice) =>
                invoice.status === 'Draft'
        ).length;

    const sent =
        invoices.filter(
            (invoice) =>
                invoice.status === 'Sent'
        ).length;

    const paid =
        invoices.filter(
            (invoice) =>
                invoice.status === 'Paid'
        ).length;

    const overdue =
        invoices.filter(
            (invoice) =>
                invoice.status === 'Overdue'
        ).length;

    const cancelled =
        invoices.filter(
            (invoice) =>
                invoice.status === 'Cancelled'
        ).length;


    const totalValue =
        invoices.reduce(
            (sum, invoice) =>
                sum + invoice.total,
            0
        );


    const outstandingValue =
        invoices.reduce(
            (sum, invoice) =>
                sum +
                (
                    invoice.total -
                    (invoice.paidAmount ?? 0)
                ),
            0
        );


    return (

        <div className="grid gap-4 md:grid-cols-4">

            <div className="rounded-xl border bg-card p-5">
                <div className="text-sm text-muted-foreground">
                    Total Invoices
                </div>

                <div className="mt-2 text-3xl font-bold">
                    {totalInvoices}
                </div>
            </div>


            <div className="rounded-xl border bg-card p-5">
                <div className="text-sm text-muted-foreground">
                    Draft
                </div>

                <div className="mt-2 text-3xl font-bold">
                    {draft}
                </div>
            </div>


            <div className="rounded-xl border bg-card p-5">
                <div className="text-sm text-muted-foreground">
                    Sent
                </div>

                <div className="mt-2 text-3xl font-bold">
                    {sent}
                </div>
            </div>


            <div className="rounded-xl border bg-card p-5">
                <div className="text-sm text-muted-foreground">
                    Paid
                </div>

                <div className="mt-2 text-3xl font-bold">
                    {paid}
                </div>
            </div>


            <div className="rounded-xl border bg-card p-5">
                <div className="text-sm text-muted-foreground">
                    Overdue
                </div>

                <div className="mt-2 text-3xl font-bold">
                    {overdue}
                </div>
            </div>


            <div className="rounded-xl border bg-card p-5">
                <div className="text-sm text-muted-foreground">
                    Cancelled
                </div>

                <div className="mt-2 text-3xl font-bold">
                    {cancelled}
                </div>
            </div>


            <div className="rounded-xl border bg-card p-5">
                <div className="text-sm text-muted-foreground">
                    Total Value
                </div>

                <div className="mt-2 text-3xl font-bold">
                    ₹ {totalValue.toLocaleString()}
                </div>
            </div>


            <div className="rounded-xl border bg-card p-5">
                <div className="text-sm text-muted-foreground">
                    Outstanding
                </div>

                <div className="mt-2 text-3xl font-bold">
                    ₹ {outstandingValue.toLocaleString()}
                </div>
            </div>

        </div>

    );

}