'use client';

import type {
    Invoice,
} from '@/types/crm/Invoices';


interface Props {

    invoices: Invoice[];

}


export default function InvoicesSummary({

    invoices,

}: Props) {


    const totalInvoices =
        invoices.length;


    const draft =
        invoices.filter(
            (invoice) =>
                invoice.status === 'Draft',
        ).length;


    const sent =
        invoices.filter(
            (invoice) =>
                invoice.status === 'Sent',
        ).length;


    const paid =
        invoices.filter(
            (invoice) =>
                invoice.status === 'Paid',
        ).length;


    const overdue =
        invoices.filter(
            (invoice) =>
                invoice.status === 'Overdue',
        ).length;


    const cancelled =
        invoices.filter(
            (invoice) =>
                invoice.status === 'Cancelled',
        ).length;



    const totalValue =
        invoices.reduce(

            (sum, invoice) =>
                sum + Number(invoice.total ?? 0),

            0,

        );



    const outstandingValue =
        invoices.reduce(

            (sum, invoice) =>
                sum +
                (
                    Number(invoice.total ?? 0) -
                    Number(invoice.paidAmount ?? 0)
                ),

            0,

        );



    const currencyFormatter =
        new Intl.NumberFormat(

            'en-IN',

            {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
            },

        );



    return (

        <div className="grid gap-4 md:grid-cols-4">


            <SummaryCard
                label="Total Invoices"
                value={totalInvoices}
            />


            <SummaryCard
                label="Draft"
                value={draft}
            />


            <SummaryCard
                label="Sent"
                value={sent}
            />


            <SummaryCard
                label="Paid"
                value={paid}
            />


            <SummaryCard
                label="Overdue"
                value={overdue}
            />


            <SummaryCard
                label="Cancelled"
                value={cancelled}
            />


            <SummaryCard
                label="Total Value"
                value={
                    currencyFormatter.format(totalValue)
                }
            />


            <SummaryCard
                label="Outstanding"
                value={
                    currencyFormatter.format(outstandingValue)
                }
            />


        </div>

    );

}



function SummaryCard({

    label,

    value,

}: {

    label: string;

    value: string | number;

}) {


    return (

        <div
            className="
                rounded-xl
                border
                bg-card
                p-5
            "
        >

            <div
                className="
                    text-sm
                    text-muted-foreground
                "
            >
                {label}
            </div>


            <div
                className="
                    mt-2
                    text-3xl
                    font-bold
                "
            >
                {value}
            </div>


        </div>

    );

}