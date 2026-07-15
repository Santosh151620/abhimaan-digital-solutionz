'use server';

import { QuotationsServiceInstance } from '@/services/crm/QuotationsService';
import type {
    Quotation,
    QuotationStatus,
} from '@/types/crm/Quotations';

export async function listQuotations() {
    return QuotationsServiceInstance.list();
}

export async function listArchivedQuotations() {
    return QuotationsServiceInstance.listArchived();
}

export async function createQuotation(
    data: Partial<Quotation>
) {
    return QuotationsServiceInstance.create(data);
}

export async function updateQuotation(
    id: string,
    data: Partial<Quotation>
) {
    return QuotationsServiceInstance.update(id, data);
}

export async function deleteQuotation(id: string) {
    return QuotationsServiceInstance.delete(id);
}

export async function restoreQuotation(id: string) {
    return QuotationsServiceInstance.restore(id);
}

export async function updateQuotationStatus(
    id: string,
    status: QuotationStatus
) {
    return QuotationsServiceInstance.updateStatus(
        id,
        status
    );
}

export async function QuotationsSummary() {
    return QuotationsServiceInstance.summary();
}
