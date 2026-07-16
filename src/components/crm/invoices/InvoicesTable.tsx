'use client';

import Link from 'next/link';

import type { Invoice } from '@/types/crm/Invoices';

interface Props {
    invoices: Invoice[];
}

export default function InvoicesTable({
    invoices,
}: Props) {

    if (invoices.length === 0) {
        return (
            <div className="rounded-xl border bg-card p-10 text-center text-muted-foreground">
                No invoices found.
            </div>
        );
    }

    const badgeClasses: Record<
        Invoice['status'],
        string
    > = {
        Draft: 'bg-gray-100 text-gray-700',
        Sent: 'bg-blue-100 text-blue-700',
        Paid: 'bg-green-100 text-green-700',
        Overdue: 'bg-red-100 text-red-700',
        Cancelled: 'bg-slate-200 text-slate-700',
    };

    return (

        <div className="overflow-x-auto rounded-xl border bg-card">

            <table className="min-w-full">

                <thead className="bg-muted/40">

                    <tr>

                        <th className="px-4 py-3 text-left">
                            Invoice
                        </th>

                        <th className="px-4 py-3 text-left">
                            Customer
                        </th>

                        <th className="px-4 py-3 text-left">
                            Due Date
                        </th>

                        <th className="px-4 py-3 text-left">
                            Amount
                        </th>

                        <th className="px-4 py-3 text-left">
                            Status
                        </th>

                        <th className="px-4 py-3 text-left">
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {invoices.map((invoice) => (

                        <tr
                            key={invoice.id}
                            className="border-t hover:bg-muted/20"
                        >

                            <td className="px-4 py-3">

                                <div className="font-medium">
                                    {invoice.title}
                                </div>

                                <div className="text-xs text-muted-foreground">
                                    {invoice.invoiceNumber}
                                </div>

                            </td>

                            <td className="px-4 py-3">
                                {invoice.customerName}
                            </td>

                            <td className="px-4 py-3">
                                {invoice.dueDate}
                            </td>

                            <td className="px-4 py-3">
                                {invoice.currency}{' '}
                                {invoice.amount.toLocaleString()}
                            </td>

                            <td className="px-4 py-3">

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClasses[invoice.status]}`}
                                >
                                    {invoice.status}
                                </span>

                            </td>

                            <td className="px-4 py-3">

                                <div className="flex gap-2">

                                    <Link
                                        href={`/crm/invoices/${invoice.id}`}
                                        className="rounded border px-3 py-1 text-sm hover:bg-muted"
                                    >
                                        View
                                    </Link>

                                    <Link
                                        href={`/crm/invoices/${invoice.id}/edit`}
                                        className="rounded border px-3 py-1 text-sm hover:bg-muted"
                                    >
                                        Edit
                                    </Link>

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}