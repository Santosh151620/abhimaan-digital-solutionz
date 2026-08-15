import Link from "next/link";

import {
    InvoicesServiceInstance,
} from "@/services/crm/InvoicesService";

import type {
    Invoice,
} from "@/types/crm/Invoices";


export const dynamic = "force-dynamic";


export default async function InvoicesPage() {

    const invoices:
        Invoice[] =
        await InvoicesServiceInstance.list();


    return (

        <div className="space-y-6 p-6">

            <header className="flex items-start justify-between gap-4">

                <div>

                    <h1 className="text-2xl font-bold">
                        Invoices
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Manage customer invoices and billing lifecycle.
                    </p>

                </div>


                <Link
                    href="/crm/invoices/new"
                    className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                    New Invoice
                </Link>

            </header>


            <section className="overflow-hidden rounded-lg border bg-background">

                {invoices.length === 0 ? (

                    <div className="p-8 text-center">

                        <h2 className="text-lg font-semibold">
                            No invoices found
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Create your first invoice to begin the billing lifecycle.
                        </p>

                        <Link
                            href="/crm/invoices/new"
                            className="mt-4 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                        >
                            Create Invoice
                        </Link>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                            <thead className="border-b bg-muted/40">

                                <tr>

                                    <th className="px-4 py-3 text-left font-medium">
                                        Invoice
                                    </th>

                                    <th className="px-4 py-3 text-left font-medium">
                                        Customer
                                    </th>

                                    <th className="px-4 py-3 text-left font-medium">
                                        Status
                                    </th>

                                    <th className="px-4 py-3 text-right font-medium">
                                        Total
                                    </th>

                                    <th className="px-4 py-3 text-left font-medium">
                                        Due Date
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y">

                                {invoices.map(
                                    (
                                        invoice,
                                    ) => (

                                        <tr
                                            key={
                                                invoice.id
                                            }
                                            className="transition-colors hover:bg-muted/30"
                                        >

                                            <td className="px-4 py-3">

                                                <Link
                                                    href={`/crm/invoices/${encodeURIComponent(invoice.id)}`}
                                                    className="font-medium hover:underline"
                                                >
                                                    {invoice.invoiceNumber}
                                                </Link>

                                                <div className="text-xs text-muted-foreground">
                                                    {invoice.title}
                                                </div>

                                            </td>


                                            <td className="px-4 py-3">

                                                {invoice.customerName ||
                                                    "—"}

                                            </td>


                                            <td className="px-4 py-3">

                                                <span className="inline-flex rounded-full border px-2.5 py-1 text-xs font-medium">
                                                    {invoice.status}
                                                </span>

                                            </td>


                                            <td className="px-4 py-3 text-right font-medium">

                                                {invoice.currency}{" "}

                                                {invoice.total.toLocaleString(
                                                    "en-IN",
                                                    {
                                                        minimumFractionDigits:
                                                            2,
                                                        maximumFractionDigits:
                                                            2,
                                                    },
                                                )}

                                            </td>


                                            <td className="px-4 py-3">

                                                {invoice.dueDate ||
                                                    "—"}

                                            </td>

                                        </tr>

                                    ),
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </div>

    );

}
