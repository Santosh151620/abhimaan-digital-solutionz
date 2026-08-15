import {
    redirect,
} from "next/navigation";


import InvoicesForm from "@/components/crm/invoices/InvoicesForm";


import {
    createInvoice,
} from "../actions";


import type {
    InvoiceStatus,
} from "@/types/crm/Invoices";



/**
 * ============================================================================
 * CRM — NEW INVOICE PAGE
 * ============================================================================
 *
 * Production-safe invoice creation page.
 *
 * Responsibilities:
 *
 * - Render the invoice creation form.
 * - Parse and validate submitted form values.
 * - Normalize invoice status against the canonical InvoiceStatus contract.
 * - Delegate persistence to the existing invoice action/service boundary.
 * - Redirect to the invoice list after successful creation.
 *
 * Business persistence remains outside the page.
 * ============================================================================
 */


/**
 * ---------------------------------------------------------------------------
 * Canonical invoice statuses
 * ---------------------------------------------------------------------------
 *
 * Kept local to the form boundary so arbitrary form strings never cross into
 * the typed Invoice domain contract.
 */
const INVOICE_STATUSES:
    readonly InvoiceStatus[] = [

    "Draft",

    "Sent",

    "Paid",

    "Overdue",

    "Cancelled",

];



function isInvoiceStatus(
    value: string,
): value is InvoiceStatus {

    return (
        INVOICE_STATUSES.includes(
            value as InvoiceStatus,
        )
    );

}



function normalizeInvoiceStatus(
    value: string,
): InvoiceStatus {

    const normalized =
        value.trim();


    if (!normalized) {

        return "Draft";

    }


    if (
        isInvoiceStatus(
            normalized,
        )
    ) {

        return normalized;

    }


    throw new Error(
        `Invalid invoice status: ${normalized}.`,
    );

}



export default function NewInvoicePage() {


    async function submit(
        formData: FormData,
    ) {

        "use server";


        if (
            !(formData instanceof FormData)
        ) {

            throw new Error(
                "Invoice form data is required.",
            );

        }


        const getString = (
            key: string,
        ): string => {

            const value =
                formData.get(key);


            return typeof value === "string"
                ? value.trim()
                : "";

        };


        const getNumber = (
            key: string,
        ): number => {

            const value =
                getString(
                    key,
                );


            if (!value) {

                return 0;

            }


            const parsed =
                Number(value);


            if (
                !Number.isFinite(
                    parsed,
                )
            ) {

                throw new Error(
                    `${key} must be a valid number.`,
                );

            }


            return parsed;

        };


        const total =
            getNumber(
                "total",
            );


        const status =
            normalizeInvoiceStatus(
                getString(
                    "status",
                ),
            );


        await createInvoice({

            invoiceNumber:
                getString(
                    "invoiceNumber",
                ),

            title:
                getString(
                    "title",
                ),

            customerName:
                getString(
                    "customerName",
                ),

            companyId:
                getString(
                    "companyId",
                ) || undefined,

            issueDate:
                getString(
                    "issueDate",
                ),

            dueDate:
                getString(
                    "dueDate",
                ),

            total,

            currency:
                getString(
                    "currency",
                ) || "INR",

            status,

            notes:
                getString(
                    "notes",
                ) || undefined,

        });


        redirect(
            "/crm/invoices",
        );

    }


    return (

        <div className="space-y-6 p-6">

            <header>

                <h1 className="text-2xl font-bold">

                    New Invoice

                </h1>


                <p className="text-sm text-muted-foreground">

                    Create a customer invoice and begin its billing lifecycle.

                </p>

            </header>


            <InvoicesForm
                action={submit}
            />

        </div>

    );

}