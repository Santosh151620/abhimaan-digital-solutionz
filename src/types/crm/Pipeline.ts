export interface PipelineStage {
    id: string;
    name: string;
    color: string;
    order: number;
}

export interface PipelineOpportunity {
    id: string;
    title: string;
    companyId: string;
    value: number;
    probability: number;
    stage: string;
}

export interface PipelineColumn {
    stage: PipelineStage;
    opportunities: PipelineOpportunity[];
    totalValue: number;
}




