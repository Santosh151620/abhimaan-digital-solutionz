/**
 * CRM Opportunities Domain Contract
 *
 * Single source of truth for:
 * - OpportunitiesRepository
 * - OpportunitiesService
 * - CRM UI
 * - API Routes
 *
 * Entity-driven CRM architecture.
 */

export type OpportunityStage =
    | 'New'
    | 'Qualified'
    | 'Proposal'
    | 'Negotiation'
    | 'Won'
    | 'Lost';

export type OpportunityStatus =
    | 'Open'
    | 'Won'
    | 'Lost'
    | 'On Hold';

export interface Opportunity {

    /**
     * Entity identity
     */
    entityType: 'Opportunity';

    entityId?: string;

    id: string;

    organizationId?: string;

    /**
     * Business identity
     */
    opportunityNumber: string;

    /**
     * Primary display name.
     */
    name: string;

    /**
     * Legacy compatibility.
     */
    title: string;

    description?: string;

    /**
     * CRM Relationships
     */
    companyId?: string;

    contactId?: string;

    leadId?: string;

    /**
     * Ownership
     */
    ownerId?: string;

    /**
     * Legacy compatibility.
     */
    owner?: string;

    assignedTo?: string;

    /**
     * Sales
     */
    stage: OpportunityStage;

    status: OpportunityStatus;

    value: number;

    probability: number;

    expectedCloseDate?: string;

    /**
     * Forecast
     */
    forecastRevenue?: number;

    recurringRevenue?: number;

    currency?: string;

    /**
     * Competition
     */
    source?: string;

    competitor?: string;

    reasonWon?: string;

    reasonLost?: string;

    /**
     * Extension
     */
    notes?: string;

    metadata?: Record<string, unknown>;

    /**
     * Lifecycle
     */
    archived?: boolean;

    isDeleted?: boolean;

    deletedAt?: string | null;

    createdAt: string;

    updatedAt: string;

}

export interface CreateOpportunityInput {

    opportunityNumber?: string;

    name: string;

    title?: string;

    description?: string;

    companyId?: string;

    contactId?: string;

    leadId?: string;

    ownerId?: string;

    assignedTo?: string;

    stage?: OpportunityStage;

    status?: OpportunityStatus;

    value?: number;

    probability?: number;

    expectedCloseDate?: string;

    forecastRevenue?: number;

    recurringRevenue?: number;

    currency?: string;

    source?: string;

    competitor?: string;

    notes?: string;

    metadata?: Record<string, unknown>;

}

export type UpdateOpportunityInput =
    Partial<CreateOpportunityInput>;

interface OpportunityFilters {

    stage?: OpportunityStage;

    status?: OpportunityStatus;

    companyId?: string;

    contactId?: string;

    leadId?: string;

    ownerId?: string;

    assignedTo?: string;

    includeArchived?: boolean;

}

export interface OpportunitySearchFilters
    extends OpportunityFilters {

    search?: string;

    keyword?: string;

    page?: number;

    limit?: number;

}

export interface OpportunitySummary {

    total: number;

    open: number;

    won: number;

    lost: number;

    pipelineValue: number;

    weightedValue: number;

    /**
     * Legacy dashboard compatibility.
     */
    totalValue: number;

    averageDealSize?: number;

    averageProbability?: number;

    winRate?: number;

}

interface PipelineOpportunity {

    id: string;

    title: string;

    companyId: string;

    value: number;

    probability: number;

    stage: OpportunityStage;

}

interface PipelineStage {

    id?: OpportunityStage;

    name: string;

    opportunities: PipelineOpportunity[];

}
