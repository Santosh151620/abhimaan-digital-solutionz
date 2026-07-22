'use client';

import Link from 'next/link';

import type {
    Payment,
} from '@/types/crm/Payments';

interface Props {

    payments: Payment[];

}

export default function PaymentsTable({

    payments,

}: Props) {

    if (
        payments.length === 0
    ) {

        return (

            <div className="rounded-xl border p-10 text-center text-muted-foreground">

                No payments found.

            </div>

        );

    }

    return (

        <div className="overflow-x-auto rounded-xl border">

            <table className="w-full">

                <thead>

                    <tr className="border-b bg-muted/40 text-left">

                        <th className="p-3">
                            Payment
                        </th>

                        <th className="p-3">
                            Customer
                        </th>

                        <th className="p-3">
                            Amount
                        </th>

                        <th className="p-3">
                            Paid
                        </th>

                        <th className="p-3">
                            Balance
                        </th>

                        <th className="p-3">
                            Method
                        </th>

                        <th className="p-3">
                            Status
                        </th>

                        <th className="p-3">
                            Due
                        </th>

                        <th className="p-3 text-right">
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {payments.map(payment => (

                        <tr
                            key={payment.id}
                            className="border-b hover:bg-muted/30"
                        >

                            <td className="p-3">

                                <div className="font-medium">

                                    {payment.paymentNumber}

                                </div>

                            </td>

                            <td className="p-3">

                                {payment.customerName}

                            </td>

                            <td className="p-3">

                                {payment.currency} {payment.amount.toLocaleString()}

                            </td>

                            <td className="p-3">

                                {payment.currency} {payment.paidAmount.toLocaleString()}

                            </td>

                            <td className="p-3">

                                {payment.currency} {payment.balanceAmount.toLocaleString()}

                            </td>

                            <td className="p-3">

                                {payment.paymentMethod}

                            </td>

                            <td className="p-3">

                                {payment.status}

                            </td>

                            <td className="p-3">

                                {payment.dueDate ?? '—'}

                            </td>

                            <td className="p-3">

                                <div className="flex justify-end gap-2">

                                    <Link
                                        href={`/crm/payments/${payment.id}`}
                                        className="rounded border px-3 py-1 text-sm"
                                    >
                                        View
                                    </Link>

                                    <Link
                                        href={`/crm/payments/${payment.id}/edit`}
                                        className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground"
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