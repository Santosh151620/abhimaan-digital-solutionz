/**
 * CRM Pipeline Domain Contract
 *
 * Single source of truth for:
 * - PipelineRepository
 * - PipelineService
 * - Opportunity Pipeline UI
 *
 * Entity-driven CRM architecture.
 */


export type PipelineStageCode =
    | 'NEW'
    | 'QUALIFIED'
    | 'PROPOSAL'
    | 'NEGOTIATION'
    | 'WON'
    | 'LOST';



export interface PipelineStage {


    id: string;


    pipelineId?: string;


    code: PipelineStageCode;


    name: string;


    description?: string;


    order: number;


    probability?: number;


    isActive?: boolean;


    metadata?: Record<string, unknown>;

}




interface SalesPipeline {


    id: string;


    organizationId?: string;


    code: string;


    name: string;


    description?: string;


    isDefault?: boolean;


    isActive?: boolean;


    stages?: PipelineStage[];


    createdAt: string;


    updatedAt: string;

}





export interface PipelineOpportunity {


    id: string;


    entityType: 'Opportunity';


    title: string;


    companyId?: string;


    value: number;


    probability: number;


    stage: PipelineStageCode;

}





export interface PipelineColumn {


    stage: PipelineStage;


    opportunities: PipelineOpportunity[];


    totalValue: number;
}

export interface PipelineSummary {


    stages: number;


    totalOpportunities: number;


    totalValue: number;


    weightedValue: number;


    /**
     * Backward compatibility
     * Existing dashboard/pipeline UI support
     */
    total: number;
    pipelineValue: number;

}

interface PipelineFilters {
    pipelineId?: string;
    stageId?: string;
    stage?: PipelineStageCode;
    search?: string;
}

interface MoveOpportunityInput {

    opportunityId: string;
    stage: PipelineStageCode;

}