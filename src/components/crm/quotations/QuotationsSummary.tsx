import type {
    Quotation,
} from '@/types/crm/Quotations';


interface Props {

    quotations: Quotation[];

}



export default function QuotationsSummary({

    quotations,

}: Props) {


    const total =
        quotations.length;



    const totalValue =
        quotations.reduce(

            (
                sum,
                quotation,
            ) =>

                sum +
                quotation.total,

            0,

        );



    const draft =
        quotations.filter(

            quotation =>

                quotation.status === 'Draft',

        ).length;



    const sent =
        quotations.filter(

            quotation =>

                quotation.status === 'Sent',

        ).length;



    const accepted =
        quotations.filter(

            quotation =>

                quotation.status === 'Accepted',

        ).length;



    const formattedValue =
        new Intl.NumberFormat(
            'en-IN',
            {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
            },
        ).format(
            totalValue,
        );



    return (

        <div className="grid gap-4 md:grid-cols-5">


            <Card
                label="Total"
                value={total}
            />


            <Card
                label="Draft"
                value={draft}
            />


            <Card
                label="Sent"
                value={sent}
            />


            <Card
                label="Accepted"
                value={accepted}
            />


            <Card
                label="Value"
                value={formattedValue}
            />


        </div>

    );

}



function Card({

    label,

    value,

}: {

    label: string;

    value: string | number;

}) {


    return (

        <div className="rounded border p-4">

            <p className="text-sm text-muted-foreground">

                {label}

            </p>


            <strong className="text-2xl">

                {value}

            </strong>


        </div>

    );

}