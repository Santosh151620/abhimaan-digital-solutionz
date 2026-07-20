'use server';

import { InvoicesServiceInstance } from '@/services/crm/InvoicesService';

import type {
    Invoice,
    InvoiceStatus,
} from '@/types/crm/Invoices';

export async function listInvoices() {
    return InvoicesServiceInstance.list();
}

export async function listArchivedInvoices() {
    return InvoicesServiceInstance.listArchived();
}

export async function getInvoice(
    id: string,
) {
    return InvoicesServiceInstance.details(id);
}

export async function createInvoice(
    data: Partial<Invoice>,
) {
    return InvoicesServiceInstance.create(data);
}

export async function updateInvoice(
    id: string,
    data: Partial<Invoice>,
) {
    return InvoicesServiceInstance.update(
        id,
        data,
    );
}

export async function deleteInvoice(
    id: string,
) {
    return InvoicesServiceInstance.delete(id);
}

export async function restoreInvoice(
    id: string,
) {
    return InvoicesServiceInstance.restore(id);
}

export async function updateInvoiceStatus(
    id: string,
    status: InvoiceStatus,
) {
    return InvoicesServiceInstance.updateStatus(
        id,
        status,
    );
}

export async function getInvoicesSummary() {
    return InvoicesServiceInstance.summary();
}