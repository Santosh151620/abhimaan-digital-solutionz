import type {
    InvoiceStatus,
} from "@/types/crm/Invoices";


import {
    notFound,
    redirect,
} from "next/navigation";


import InvoicesForm from "@/components/crm/invoices/InvoicesForm";


import {
    getInvoice,
    updateInvoice,
} from "../../actions";



interface Props {

    params: Promise<{
        id: string;
    }>;

}



function getFormString(
    formData: FormData,
    key: string,
): string {

    const value =
        formData.get(key);


    return typeof value === "string"
        ? value.trim()
        : "";

}



function getFormNumber(
    formData: FormData,
    key: string,
): number {

    const value =
        getFormString(
            formData,
            key,
        );


    if (!value) {

        return 0;

    }


    const parsed =
        Number(value);


    if (!Number.isFinite(parsed)) {

        throw new Error(
            `${key} must be a valid number.`,
        );

    }


    return parsed;

}



function getInvoiceStatus(
    formData: FormData,
    fallback: InvoiceStatus,
): InvoiceStatus {

    const value =
        getFormString(
            formData,
            "status",
        );


    return (
        value || fallback
    ) as InvoiceStatus;

}



export default async function EditInvoicePage({
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


    /*
     * Preserve the narrowed invoice value for
     * the nested server action closure.
     */
    const existingInvoice =
        invoice;



    async function submit(
        formData: FormData,
    ): Promise<void> {

        "use server";


        const companyId =
            getFormString(
                formData,
                "companyId",
            );


        await updateInvoice(

            id,

            {

                invoiceNumber:
                    getFormString(
                        formData,
                        "invoiceNumber",
                    ),


                title:
                    getFormString(
                        formData,
                        "title",
                    ),


                customerName:
                    getFormString(
                        formData,
                        "customerName",
                    ),


                companyId:
                    companyId || undefined,


                issueDate:
                    getFormString(
                        formData,
                        "issueDate",
                    ),


                dueDate:
                    getFormString(
                        formData,
                        "dueDate",
                    ),


                total:
                    getFormNumber(
                        formData,
                        "total",
                    ),


                currency:
                    getFormString(
                        formData,
                        "currency",
                    ) || "INR",


                status:
                    getInvoiceStatus(
                        formData,
                        existingInvoice.status,
                    ),


                notes:
                    getFormString(
                        formData,
                        "notes",
                    ) || undefined,

            },

        );


        redirect(
            `/crm/invoices/${id}`,
        );

    }



    return (

        <div className="space-y-6 p-6">


            <header>

                <h1 className="text-2xl font-bold">

                    Edit Invoice

                </h1>


                <p className="text-sm text-muted-foreground">

                    {existingInvoice.invoiceNumber}

                </p>

            </header>


            <InvoicesForm

                initialData={existingInvoice}

                action={submit}

            />


        </div>

    );

}
