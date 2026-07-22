'use client';

import type { Quotation } from '@/types/crm/Quotations';

interface Props {
    quotations: Quotation[];
}

export default function QuotationsExport({
    quotations,
}: Props) {


    function exportCsv() {

        const headers = [
            'Quotation Number',
            'Customer',
            'Title',
            'Amount',
            'Status',
            'Issue Date',
            'Valid Until',
        ];


        const rows = quotations.map(
            (quotation) => [

                quotation.quotationNumber,
                quotation.customerName,
                quotation.title,
                quotation.amount,
                quotation.status,
                quotation.issueDate,
                quotation.validUntil,

            ]
        );


        const csv = [
            headers,
            ...rows,
        ]
            .map(
                row =>
                    row.join(',')
            )
            .join('\n');


        const blob =
            new Blob(
                [csv],
                {
                    type: 'text/csv',
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement('a');


        link.href = url;

        link.download =
            'quotations.csv';


        link.click();


        URL.revokeObjectURL(url);

    }


    return (

        <button
            type="button"
            onClick={exportCsv}
            className="rounded-lg border px-4 py-2 hover:bg-muted"
        >
            Export CSV
        </button>

    );

}