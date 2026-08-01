export type ContractStatus =
    | 'Draft'
    | 'Pending'
    | 'Active'
    | 'Completed'
    | 'Expired'
    | 'Terminated'
    | 'Cancelled';

export interface Contract {

    /**
     * Entity
     */
    id: string;

    entityType: 'Contract';

    entityId?: string;

    organizationId?: string;

    /**
     * Relationships
     */
    companyId?: string;

    contactId?: string;

    quotationId?: string;

    invoiceId?: string;

    ownerId?: string;

    /**
     * Business
     */
    contractNumber: string;

    title: string;

    description?: string;

    /**
     * UI compatibility
     */
    customerName?: string;

    /**
     * Lifecycle
     */
    status: ContractStatus;

    startDate?: string;

    endDate?: string;

    renewalDate?: string;

    autoRenew: boolean;

    /**
     * Financial
     */
    currency: string;

    subtotal: number;

    tax: number;

    discount: number;

    total: number;

    /**
     * Legacy compatibility
     * Existing UI still uses value.
     */
    value: number;

    /**
     * Execution
     */
    signedDate?: string;

    signedBy?: string;

    documentUrl?: string;

    /**
     * Additional Information
     */
    notes?: string;

    metadata?: Record<string, unknown>;

    archived: boolean;

    /**
     * Audit
     */
    createdBy?: string;

    updatedBy?: string;

    createdAt: string;

    updatedAt: string;

}

export interface ContractSummary {

    total: number;

    draft: number;

    pending: number;

    active: number;

    completed: number;

    expired: number;

    terminated: number;

    cancelled: number;

    archived: number;

    totalValue: number;

    activeValue: number;

}

export interface ContractSearchFilters {

    status?: ContractStatus;

    companyId?: string;

    search?: string;

}