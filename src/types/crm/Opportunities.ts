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

    id: string;

    opportunityNumber: string;

    /**
     * Primary display name.
     */
    name: string;

    /**
     * Backward compatibility for older pages/components.
     */
    title: string;

    description?: string;

    companyId?: string;

    contactId?: string;

    leadId?: string;

    ownerId?: string;

    /**
     * Legacy compatibility.
     */
    owner?: string;

    stage: OpportunityStage;

    status: OpportunityStatus;

    value: number;

    probability: number;

    expectedCloseDate?: string;

    createdAt: string;

    updatedAt: string;

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

}


export interface PipelineOpportunity {

    id: string;

    title: string;

    companyId: string;

    value: number;

    probability: number;

    stage: OpportunityStage;

}


export interface PipelineStage {

    id: OpportunityStage;

    name: string;

    opportunities: PipelineOpportunity[];

}
