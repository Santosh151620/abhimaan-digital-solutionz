'use client';
import type { QuotationStatus } from '@/types/crm/Quotations';
import { useState } from 'react';

import {
    createQuotation,
} from '@/app/crm/quotations/actions';


export default function QuotationsImport() {

    const [message, setMessage] =
        useState('');


    async function handleImport(
        event: React.ChangeEvent<HTMLInputElement>
    ) {

        const file =
            event.target.files?.[0];


        if (!file) {
            return;
        }


        const text =
            await file.text();


        const rows =
            text
                .split('\n')
                .slice(1)
                .filter(Boolean);


        let imported = 0;


        for (const row of rows) {

            const [
                quotationNumber,
                customerName,
                title,
                amount,
                status,
                issueDate,
                validUntil,
            ] =
                row.split(',');


            await createQuotation({

                quotationNumber,

                customerName,

                title,

                amount:
                    Number(amount) || 0,

                status:
    (status || 'Draft') as QuotationStatus,

                issueDate,

                validUntil,

            });


            imported++;

        }


        setMessage(
            `${imported} quotations imported`
        );

    }


    return (

        <div className="space-y-2">

            <label className="cursor-pointer rounded-lg border px-4 py-2">

                Import CSV

                <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleImport}
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