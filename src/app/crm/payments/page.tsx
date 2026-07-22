import Link from 'next/link';

import {
    getPayments,
} from './actions';

import {
    PaymentsTable,
} from '@/components/crm/payments';

export default async function PaymentsPage() {

    const payments =
        await getPayments();

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        Payments
                    </h1>

                    <p className="text-muted-foreground">
                        Track customer payments.
                    </p>

                </div>

                <Link
                    href="/crm/payments/new"
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                >
                    New Payment
                </Link>

            </div>

            <PaymentsTable
                payments={payments}
            />

        </div>

    );

}