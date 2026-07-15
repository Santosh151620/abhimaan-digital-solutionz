'use server';

import { PipelineServiceInstance } from '@/services/crm/PipelineService';
import type { OpportunityStage } from '@/types/crm/Opportunities';

export async function listPipeline() {
    return PipelineServiceInstance.list();
}

export async function moveOpportunity(
    id: string,
    stage: OpportunityStage
) {
    return PipelineServiceInstance.moveOpportunity(
        id,
        stage
    );
}

export async function pipelineSummary() {
    return PipelineServiceInstance.summary();
}