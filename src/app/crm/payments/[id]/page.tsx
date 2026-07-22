import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
    getPayment,
} from '../actions';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function PaymentDetailsPage({
    params,
}: Props) {

    const { id } =
        await params;

    const payment =
        await getPayment(id);

    if (!payment) {
        notFound();
    }

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        {payment.customerName}
                    </h1>

                    <p className="text-muted-foreground">
                        {payment.paymentNumber}
                    </p>

                </div>

                <Link
                    href={`/crm/payments/${payment.id}/edit`}
                    className="rounded-lg border px-4 py-2"
                >
                    Edit
                </Link>

            </div>

            <div className="grid gap-4 rounded-xl border bg-card p-6 md:grid-cols-2">

                <div>
                    <div className="text-sm text-muted-foreground">
                        Company
                    </div>

                    <div className="font-medium">
                        {payment.companyId || '-'}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Invoice
                    </div>

                    <div className="font-medium">
                        {payment.invoiceId || '-'}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Status
                    </div>

                    <div className="font-medium">
                        {payment.status}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Method
                    </div>

                    <div className="font-medium">
                        {payment.paymentMethod}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Amount
                    </div>

                    <div className="font-medium">
                        {payment.currency} {payment.amount.toLocaleString()}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Paid
                    </div>

                    <div className="font-medium">
                        {payment.currency} {payment.paidAmount.toLocaleString()}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Balance
                    </div>

                    <div className="font-medium">
                        {payment.currency} {payment.balanceAmount.toLocaleString()}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Due Date
                    </div>

                    <div className="font-medium">
                        {payment.dueDate || '-'}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Payment Date
                    </div>

                    <div className="font-medium">
                        {payment.paymentDate || '-'}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Reference
                    </div>

                    <div className="font-medium">
                        {payment.referenceNumber || '-'}
                    </div>
                </div>

            </div>

            {payment.description && (

                <div className="rounded-xl border bg-card p-6">

                    <h2 className="mb-2 font-semibold">
                        Description
                    </h2>

                    <p className="whitespace-pre-wrap">
                        {payment.description}
                    </p>

                </div>

            )}

            {payment.notes && (

                <div className="rounded-xl border bg-card p-6">

                    <h2 className="mb-2 font-semibold">
                        Notes
                    </h2>

                    <p className="whitespace-pre-wrap">
                        {payment.notes}
                    </p>

                </div>

            )}

        </div>

    );

}