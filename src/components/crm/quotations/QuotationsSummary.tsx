import type { Quotation } from '@/types/crm/Quotations';

interface Props {
    quotations: Quotation[];
}

export default function QuotationsSummary({
    quotations,
}: Props) {

    const total =
        quotations.reduce(
            (sum, q) => sum + q.amount,
            0
        );

    return (

        <div className="rounded border p-4">

            <p>Total Quotations: {quotations.length}</p>

            <p>Total Value: ₹ {total}</p>

        </div>

    );

}