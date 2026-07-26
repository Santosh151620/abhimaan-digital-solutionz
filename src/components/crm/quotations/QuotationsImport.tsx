'use client';

import {
    useState,
} from 'react';

import {
    createQuotation,
} from '@/app/crm/quotations/actions';

import type {
    QuotationStatus,
} from '@/types/crm/Quotations';



const validStatuses:
    QuotationStatus[] =
[
    'Draft',
    'Sent',
    'Accepted',
    'Rejected',
];



function parseCsvLine(
    line: string,
) {

    const values: string[] = [];

    let current = '';

    let insideQuotes = false;


    for (
        let i = 0;
        i < line.length;
        i++
    ) {

        const char =
            line[i];


        if (char === '"') {

            insideQuotes =
                !insideQuotes;

            continue;

        }


        if (
            char === ','
            &&
            !insideQuotes
        ) {

            values.push(
                current.trim(),
            );

            current = '';

            continue;

        }


        current += char;

    }


    values.push(
        current.trim(),
    );


    return values;

}



export default function QuotationsImport() {


    const [
        message,
        setMessage,
    ] =
        useState('');



    const [
        loading,
        setLoading,
    ] =
        useState(false);



    async function handleImport(

        event:
            React.ChangeEvent<HTMLInputElement>,

    ) {


        const file =
            event.target.files?.[0];


        if (!file) {

            return;

        }



        setLoading(true);

        setMessage('');



        try {


            const text =
                await file.text();



            const lines =
                text
                    .replace(
                        /^\uFEFF/,
                        '',
                    )
                    .split(/\r?\n/)
                    .filter(Boolean);



            if (lines.length <= 1) {

                setMessage(
                    'CSV contains no data',
                );

                return;

            }



            const rows =
                lines.slice(1);



            let imported = 0;



            for (const row of rows) {


                const [

                    quotationNumber,

                    customerName,

                    title,

                    amount,

                    currency,

                    status,

                    issueDate,

                    validUntil,

                ] =
                    parseCsvLine(
                        row,
                    );



                const quotationStatus =

                    validStatuses.includes(
                        status as QuotationStatus,
                    )

                    ? status as QuotationStatus

                    : 'Draft';



                await createQuotation({

                    quotationNumber,

                    customerName,

                    title,

                    amount:
                        Number(amount) || 0,

                    currency:
                        currency || 'INR',

                    status:
                        quotationStatus,

                    issueDate,

                    validUntil,

                });



                imported++;

            }



            setMessage(

                `${imported} quotations imported`

            );


        }

        catch {

            setMessage(
                'Import failed. Please check CSV format.',
            );

        }

        finally {

            setLoading(false);

        }


    }



    return (

        <div className="space-y-2">


            <label className="cursor-pointer rounded-lg border px-4 py-2">

                {loading
                    ? 'Importing...'
                    : 'Import CSV'
                }



                <input

                    type="file"

                    accept=".csv"

                    className="hidden"

                    onChange={
                        handleImport
                    }

                />


            </label>



            {message && (

                <p className="text-sm text-muted-foreground">

                    {message}

                </p>

            )}


        </div>

    );

}