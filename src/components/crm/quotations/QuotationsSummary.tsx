import type { Quotation } from '@/types/crm/Quotations';

interface Props {
    quotations: Quotation[];
}

export default function QuotationsSummary({
    quotations,
}: Props) {

    const total =
        quotations.length;

    const value =
        quotations.reduce(
            (sum, quotation) =>
                sum + quotation.total,
            0
        );

    const draft =
        quotations.filter(
            quotation =>
                quotation.status === 'Draft'
        ).length;

    const sent =
        quotations.filter(
            quotation =>
                quotation.status === 'Sent'
        ).length;

    const accepted =
        quotations.filter(
            quotation =>
                quotation.status === 'Accepted'
        ).length;


    return (

        <div className="grid gap-4 md:grid-cols-5">

            <div className="rounded border p-4">
                <p>Total</p>
                <strong>{total}</strong>
            </div>

            <div className="rounded border p-4">
                <p>Draft</p>
                <strong>{draft}</strong>
            </div>

            <div className="rounded border p-4">
                <p>Sent</p>
                <strong>{sent}</strong>
            </div>

            <div className="rounded border p-4">
                <p>Accepted</p>
                <strong>{accepted}</strong>
            </div>

            <div className="rounded border p-4">
                <p>Value</p>
                <strong>
                    ₹ {value}
                </strong>
            </div>

        </div>

    );

}