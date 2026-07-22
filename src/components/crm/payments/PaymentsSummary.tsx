import type {
    PaymentSummary,
} from '@/types/crm/Payments';

interface Props {
    summary: PaymentSummary;
}

export default function PaymentsSummary({
    summary,
}: Props) {

    return (

        <div className="grid gap-4 md:grid-cols-4 xl:grid-cols-8">

            <SummaryCard
                title="Total"
                value={summary.total}
            />

            <SummaryCard
                title="Pending"
                value={summary.pending}
            />

            <SummaryCard
                title="Paid"
                value={summary.paid}
            />

            <SummaryCard
                title="Overdue"
                value={summary.overdue}
            />

            <SummaryCard
                title="Cancelled"
                value={summary.cancelled}
            />

            <SummaryCard
                title="Refunded"
                value={summary.refunded}
            />

            <SummaryCard
                title="Received"
                value={summary.totalReceived.toLocaleString()}
            />

            <SummaryCard
                title="Outstanding"
                value={summary.totalOutstanding.toLocaleString()}
            />

        </div>

    );

}

function SummaryCard({

    title,

    value,

}: {

    title: string;

    value: string | number;

}) {

    return (

        <div className="rounded-xl border bg-card p-4">

            <div className="text-xs text-muted-foreground">

                {title}

            </div>

            <div className="mt-2 text-2xl font-bold">

                {value}

            </div>

        </div>

    );

}