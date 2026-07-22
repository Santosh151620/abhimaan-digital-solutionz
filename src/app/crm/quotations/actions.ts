'use server';

import { QuotationsServiceInstance } from '@/services/crm/QuotationsService';
import type {
    Quotation,
    QuotationStatus,
} from '@/types/crm/Quotations';

export async function getQuotations() {
    return QuotationsServiceInstance.list();
}

export async function getArchivedQuotations() {
    return QuotationsServiceInstance.listArchived();
}

export async function getQuotation(
    id: string,
) {
    return QuotationsServiceInstance.details(id);
}

export async function createQuotation(
    data: Partial<Quotation>,
) {
    return QuotationsServiceInstance.create(data);
}

export async function updateQuotation(
    id: string,
    data: Partial<Quotation>,
) {
    return QuotationsServiceInstance.update(
        id,
        data,
    );
}

export async function archiveQuotation(
    id: string,
) {
    return QuotationsServiceInstance.delete(id);
}

export async function restoreQuotation(
    id: string,
) {
    return QuotationsServiceInstance.restore(id);
}

export async function updateQuotationStatus(
    id: string,
    status: QuotationStatus,
) {
    return QuotationsServiceInstance.updateStatus(
        id,
        status,
    );
}

export async function getQuotationSummary() {
    return QuotationsServiceInstance.summary();

    
}
export async function searchQuotations(
    filters?: {
        status?: QuotationStatus;
        search?: string;
    },
) {
    return QuotationsServiceInstance.search(
        filters,
    );
}