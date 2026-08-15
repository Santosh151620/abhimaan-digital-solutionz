import {
    notFound,
} from "next/navigation";


import {
    getInvoice,
} from "../actions";



interface Props {

    params: Promise<{
        id: string;
    }>;

}



function formatDate(
    value?: string | null,
): string {

    if (!value) {

        return "-";

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {

        return value;

    }


    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        },
    ).format(date);

}



function formatCurrency(
    value: number | null | undefined,
    currency?: string | null,
): string {

    const amount =
        typeof value === "number" &&
        Number.isFinite(value)
            ? value
            : 0;


    const code =
        typeof currency === "string" &&
        currency.trim()
            ? currency.trim().toUpperCase()
            : "INR";


    try {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: code,
                maximumFractionDigits: 2,
            },
        ).format(amount);

    } catch {

        return `${code} ${amount.toLocaleString("en-IN")}`;

    }

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


    const total =
        formatCurrency(
            invoice.total,
            invoice.currency,
        );


    const balance =
        formatCurrency(
            invoice.balanceAmount ?? 0,
            invoice.currency,
        );


    return (

        <main className="space-y-6 p-6">


            <header>

                <h1 className="text-3xl font-bold">

                    {invoice.title || "Invoice"}

                </h1>


                <p className="text-muted-foreground">

                    {invoice.invoiceNumber}

                </p>

            </header>



            <section
                aria-label="Invoice details"
                className="grid gap-6 rounded-xl border bg-card p-6 md:grid-cols-2"
            >


                <div>

                    <div className="text-sm text-muted-foreground">

                        Customer

                    </div>


                    <div className="font-medium">

                        {invoice.customerName || "-"}

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

                        {formatDate(
                            invoice.issueDate,
                        )}

                    </div>

                </div>



                <div>

                    <div className="text-sm text-muted-foreground">

                        Due Date

                    </div>


                    <div className="font-medium">

                        {formatDate(
                            invoice.dueDate,
                        )}

                    </div>

                </div>



                <div>

                    <div className="text-sm text-muted-foreground">

                        Total

                    </div>


                    <div className="font-medium">

                        {total}

                    </div>

                </div>



                <div>

                    <div className="text-sm text-muted-foreground">

                        Balance

                    </div>


                    <div className="font-medium">

                        {balance}

                    </div>

                </div>


            </section>



            {invoice.notes && (

                <section className="rounded-xl border bg-card p-6">

                    <h2 className="mb-2 font-semibold">

                        Notes

                    </h2>


                    <p className="whitespace-pre-wrap">

                        {invoice.notes}

                    </p>

                </section>

            )}


        </main>

    );

}
