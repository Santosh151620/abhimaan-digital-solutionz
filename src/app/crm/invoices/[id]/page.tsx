import {
    notFound,
} from 'next/navigation';

import {
    getInvoice,
} from '../actions';


interface Props {

    params: Promise<{
        id: string;
    }>;

}


export default async function InvoicePage({
    params,
}: Props) {


    const {
        id,
    } = await params;


    const invoice =
        await getInvoice(id);


    if (!invoice) {

        notFound();

    }


    return (

        <div className="space-y-6 p-6">


            <div>

                <h1 className="text-3xl font-bold">
                    {invoice.title ?? 'Invoice'}
                </h1>


                <p className="text-muted-foreground">
                    {invoice.invoiceNumber}
                </p>

            </div>



            <div className="grid gap-6 md:grid-cols-2 rounded-xl border bg-card p-6">


                <div>

                    <div className="text-sm text-muted-foreground">
                        Customer
                    </div>

                    <div className="font-medium">
                        {invoice.customerName}
                    </div>

                </div>



                <div>

                    <div className="text-sm text-muted-foreground">
                        Status
                    </div>

                    <div className="font-medium">
                        {invoice.status}
                    </div>

                </div>



                <div>

                    <div className="text-sm text-muted-foreground">
                        Issue Date
                    </div>

                    <div className="font-medium">
                        {invoice.issueDate}
                    </div>

                </div>



                <div>

                    <div className="text-sm text-muted-foreground">
                        Due Date
                    </div>

                    <div className="font-medium">
                        {invoice.dueDate}
                    </div>

                </div>



                <div>

                    <div className="text-sm text-muted-foreground">
                        Total
                    </div>

                    <div className="font-medium">
                        {invoice.currency}{' '}
                        {invoice.total.toLocaleString()}
                    </div>

                </div>



                <div>

                    <div className="text-sm text-muted-foreground">
                        Balance
                    </div>

                    <div className="font-medium">
                        {invoice.currency}{' '}
                        {(invoice.balanceAmount ?? 0).toLocaleString()}
                    </div>

                </div>


            </div>



            {invoice.notes && (

                <div className="rounded-xl border bg-card p-6">

                    <h2 className="mb-2 font-semibold">
                        Notes
                    </h2>


                    <p className="whitespace-pre-wrap">
                        {invoice.notes}
                    </p>


                </div>

            )}


        </div>

    );

}