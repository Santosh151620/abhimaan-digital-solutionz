/**
 * CRM Quotations Domain Contract
 *
 * Single source of truth for:
 * - QuotationsRepository
 * - QuotationsService
 * - CRM UI
 * - API routes
 *
 * Entity-driven CRM architecture.
 */


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
     * Entity identity
     */
    entityType: 'Quotation';

    entityId?: string;

    id: string;

    organizationId?: string;



    /**
     * Business identity
     */
    quotationNumber: string;



    /**
     * Relationships
     */
    companyId?: string;

    opportunityId?: string;



    /**
     * Display
     */
    title: string;

    customerName: string;



    /**
     * Financial
     */
    amount: number;

    subtotal: number;

    tax: number;

    discount: number;

    total: number;

    currency: string;



    /**
     * Lifecycle
     */
    status: QuotationStatus;

    issueDate: string;

    validUntil: string;



    /**
     * Content
     */
    notes?: string;

    items: QuotationItem[];



    /**
     * Extension
     */
    metadata?: Record<string, unknown>;

    archived: boolean;



    /**
     * Audit
     */
    createdAt: string;

    updatedAt: string;

}



export interface QuotationSearchFilters {

    status?: QuotationStatus;

    companyId?: string;

    opportunityId?: string;

    search?: string;

    keyword?: string;

}



export interface QuotationSummary {

    total: number;

    draft: number;

    sent: number;

    accepted: number;

    rejected: number;

    totalValue: number;

}