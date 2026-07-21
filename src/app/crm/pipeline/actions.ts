'use server';

import {
    PipelineServiceInstance,
} from '@/services/crm/PipelineService';

import type {
    OpportunityStage,
} from '@/types/crm/Opportunities';

export async function getPipeline() {
    return PipelineServiceInstance.list();
}

export async function getPipelineSummary() {
    return PipelineServiceInstance.summary();
}

export async function moveOpportunity(
    id: string,
    stage: OpportunityStage,
) {
    return PipelineServiceInstance.moveOpportunity(
        id,
        stage,
    );
}