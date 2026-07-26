'use client';

import type {
    Quotation,
} from '@/types/crm/Quotations';



interface Props {

    quotations: Quotation[];

}



function escapeCsvValue(
    value: unknown,
) {

    const text =
        String(
            value ?? '',
        );


    return `"${text.replace(
        /"/g,
        '""',
    )}"`;

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

            'Currency',

            'Status',

            'Issue Date',

            'Valid Until',

        ];



        const rows =

            quotations.map(

                quotation => [

                    quotation.quotationNumber,

                    quotation.customerName,

                    quotation.title,

                    quotation.total,

                    quotation.currency,

                    quotation.status,

                    quotation.issueDate,

                    quotation.validUntil,

                ],

            );



        const csv = [

            headers,

            ...rows,

        ]

            .map(

                row =>

                    row

                        .map(
                            escapeCsvValue,
                        )

                        .join(','),

            )

            .join('\n');



        const blob =

            new Blob(

                [

                    '\uFEFF',

                    csv,

                ],

                {

                    type:
                        'text/csv;charset=utf-8',

                },

            );



        const url =

            URL.createObjectURL(
                blob,
            );



        const link =

            document.createElement(
                'a',
            );


        link.href = url;


        link.download =
            'quotations.csv';



        document.body.appendChild(
            link,
        );


        link.click();



        document.body.removeChild(
            link,
        );


        URL.revokeObjectURL(
            url,
        );

    }



    return (

        <button

            type="button"

            onClick={exportCsv}

            className="
                rounded-lg
                border
                px-4
                py-2
                hover:bg-muted
            "

        >

            Export CSV

        </button>

    );

}