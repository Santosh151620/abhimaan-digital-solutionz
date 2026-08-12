import Link from "next/link";

import {
    getPayments,
    getPaymentsSummary,
} from "./actions";

import {
    PaymentsSummary,
    PaymentsTable,
} from "@/components/crm/payments";


export default async function PaymentsPage() {

    const [
        payments,
        summary,
    ] = await Promise.all([
        getPayments(),
        getPaymentsSummary(),
    ]);


    return (

        <main
            className="
                space-y-6
                p-4
                sm:p-6
                lg:p-8
            "
        >

            <section
                className="
                    flex
                    flex-col
                    gap-4
                    rounded-2xl
                    border
                    border-border
                    bg-card
                    p-6
                    shadow-sm
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >

                <div>

                    <h1
                        className="
                            text-3xl
                            font-bold
                            tracking-tight
                        "
                    >
                        Payments
                    </h1>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-muted-foreground
                        "
                    >
                        Track customer payments,
                        outstanding balances,
                        and revenue collection.
                    </p>

                </div>


                <Link
                    href="/crm/payments/new"
                    className="
                        inline-flex
                        items-center
                        justify-center
                        rounded-lg
                        bg-primary
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-primary-foreground
                        transition
                        hover:opacity-90
                    "
                >
                    New Payment
                </Link>

            </section>


            <section>

                <PaymentsSummary
                    summary={summary}
                />

            </section>


            <section
                className="
                    rounded-2xl
                    border
                    border-border
                    bg-card
                    p-4
                    shadow-sm
                    sm:p-6
                "
            >

                <PaymentsTable
                    payments={payments}
                />

            </section>


        </main>

    );
}