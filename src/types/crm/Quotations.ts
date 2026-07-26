export type QuotationStatus =
    | 'Draft'
    | 'Sent'
    | 'Accepted'
    | 'Rejected';

export interface QuotationItem {

    id: string;

    description: string;

    quantity: number;

    unitPrice: number;

    total: number;

}

export interface Quotation {

    /**
     * New standardized entity identifier.
     */
    entityType: 'Quotation';

    id: string;

    quotationNumber: string;

    organizationId?: string;

    companyId: string;

    opportunityId?: string;

    title: string;

    customerName: string;

    amount: number;

    status: QuotationStatus;

    issueDate: string;

    validUntil: string;

    subtotal: number;

    tax: number;

    discount: number;

    total: number;

    currency: string;

    notes?: string;

    items: QuotationItem[];

    archived: boolean;

    createdAt: string;

    updatedAt: string;

}

export interface QuotationSearchFilters {

    status?: QuotationStatus;

    companyId?: string;

    opportunityId?: string;

    search?: string;

}

export interface QuotationSummary {

    total: number;

    draft: number;

    sent: number;

    accepted: number;

    rejected: number;

    totalValue: number;

}