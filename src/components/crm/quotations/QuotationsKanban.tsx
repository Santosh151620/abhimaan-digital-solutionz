'use client';

import Link from 'next/link';

import type {
    Quotation,
    QuotationStatus,
} from '@/types/crm/Quotations';


interface Props {
    quotations: Quotation[];
}


const columns: QuotationStatus[] = [
    'Draft',
    'Sent',
    'Accepted',
    'Rejected',
];


export default function QuotationsKanban({
    quotations,
}: Props) {


    return (

        <div className="grid gap-4 md:grid-cols-4">

            {columns.map((status) => (

                <div
                    key={status}
                    className="rounded-xl border bg-background p-4"
                >

                    <h2 className="mb-4 font-semibold">
                        {status}
                    </h2>


                    <div className="space-y-3">

                        {quotations
                            .filter(
                                quotation =>
                                    quotation.status === status
                            )
                            .map((quotation) => (

                                <Link
                                    key={quotation.id}
                                    href={`/crm/quotations/${quotation.id}`}
                                    className="block rounded-lg border p-3 hover:bg-muted"
                                >

                                    <p className="font-medium">
                                        {quotation.quotationNumber}
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        {quotation.customerName}
                                    </p>

                                    <p className="text-sm">
                                        ₹ {quotation.total}
                                    </p>

                                </Link>

                            ))}


                        {quotations.filter(
                            quotation =>
                                quotation.status === status
                        ).length === 0 && (

                            <p className="text-sm text-muted-foreground">
                                No quotations
                            </p>

                        )}

                    </div>

                </div>

            ))}

        </div>

    );

}