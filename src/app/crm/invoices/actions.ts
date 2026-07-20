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

export async function saveInvoice(
    formData: FormData,
) {
    await InvoicesServiceInstance.create({
        invoiceNumber: String(
            formData.get('invoiceNumber') ?? '',
        ),
        title: String(
            formData.get('title') ?? '',
        ),
        customerName: String(
            formData.get('customerName') ?? '',
        ),
        companyId: String(
            formData.get('companyId') ?? '',
        ),
        issueDate: String(
            formData.get('issueDate') ?? '',
        ),
        dueDate: String(
            formData.get('dueDate') ?? '',
        ),
        total: Number(
            formData.get('total') ?? 0,
        ),
        currency: String(
            formData.get('currency') ?? 'INR',
        ),
        status: (
            formData.get('status') as InvoiceStatus
        ) ?? 'Draft',
        notes: String(
            formData.get('notes') ?? '',
        ),
    });
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