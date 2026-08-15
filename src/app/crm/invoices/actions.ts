"use server";


import {
    InvoicesServiceInstance,
} from "@/services/crm/InvoicesService";


import type {
    Invoice,
    InvoiceStatus,
} from "@/types/crm/Invoices";



type InvoiceInput =
    Partial<Invoice>;



function validateId(
    id: string,
): string {

    const normalized =
        typeof id === "string"
            ? id.trim()
            : "";


    if (!normalized) {

        throw new Error(
            "Invoice id is required.",
        );

    }


    return normalized;

}



function validateData(
    data: InvoiceInput,
): InvoiceInput {

    if (
        !data ||
        typeof data !== "object" ||
        Array.isArray(data)
    ) {

        throw new Error(
            "Invoice data is required.",
        );

    }


    return data;

}



function getString(
    formData: FormData,
    key: string,
): string {

    const value =
        formData.get(key);


    return typeof value === "string"
        ? value.trim()
        : "";

}



function getOptionalString(
    formData: FormData,
    key: string,
): string | undefined {

    const value =
        getString(
            formData,
            key,
        );


    return value || undefined;

}



function getNumber(
    formData: FormData,
    key: string,
): number {

    const value =
        getString(
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



function getStatus(
    formData: FormData,
): InvoiceStatus {

    const value =
        getString(
            formData,
            "status",
        );


    if (!value) {

        return "Draft";

    }


    return value as InvoiceStatus;

}



/**
 * ============================================================================
 * READ
 * ============================================================================
 */

export async function listInvoices() {

    return InvoicesServiceInstance.list();

}



export async function listArchivedInvoices() {

    return InvoicesServiceInstance.listArchived();

}



export async function getInvoice(
    id: string,
) {

    const normalizedId =
        validateId(id);


    return InvoicesServiceInstance.details(
        normalizedId,
    );

}



export async function getInvoicesSummary() {

    return InvoicesServiceInstance.summary();

}



/**
 * ============================================================================
 * CREATE
 * ============================================================================
 */

export async function createInvoice(
    data: InvoiceInput,
) {

    const normalizedData =
        validateData(data);


    return InvoicesServiceInstance.create(
        normalizedData,
    );

}



export async function saveInvoice(
    formData: FormData,
) {

    if (!(formData instanceof FormData)) {

        throw new Error(
            "Invoice form data is required.",
        );

    }


    const invoice: Partial<Invoice> = {

        invoiceNumber:
            getString(
                formData,
                "invoiceNumber",
            ),

        title:
            getString(
                formData,
                "title",
            ),

        customerName:
            getString(
                formData,
                "customerName",
            ),

        companyId:
            getOptionalString(
                formData,
                "companyId",
            ),

        issueDate:
            getString(
                formData,
                "issueDate",
            ),

        dueDate:
            getString(
                formData,
                "dueDate",
            ),

        total:
            getNumber(
                formData,
                "total",
            ),

        currency:
            getString(
                formData,
                "currency",
            ) || "INR",

        status:
            getStatus(
                formData,
            ),

        notes:
            getOptionalString(
                formData,
                "notes",
            ),

    };


    return InvoicesServiceInstance.create(
        invoice,
    );

}



/**
 * ============================================================================
 * UPDATE
 * ============================================================================
 */

export async function updateInvoice(
    id: string,
    data: InvoiceInput,
) {

    const normalizedId =
        validateId(id);


    const normalizedData =
        validateData(data);


    return InvoicesServiceInstance.update(
        normalizedId,
        normalizedData,
    );

}



/**
 * ============================================================================
 * DELETE / RESTORE
 * ============================================================================
 */

export async function deleteInvoice(
    id: string,
) {

    const normalizedId =
        validateId(id);


    return InvoicesServiceInstance.delete(
        normalizedId,
    );

}



export async function restoreInvoice(
    id: string,
) {

    const normalizedId =
        validateId(id);


    return InvoicesServiceInstance.restore(
        normalizedId,
    );

}



/**
 * ============================================================================
 * STATUS
 * ============================================================================
 */

export async function updateInvoiceStatus(
    id: string,
    status: InvoiceStatus,
) {

    const normalizedId =
        validateId(id);


    if (!status) {

        throw new Error(
            "Invoice status is required.",
        );

    }


    return InvoicesServiceInstance.updateStatus(
        normalizedId,
        status,
    );

}
