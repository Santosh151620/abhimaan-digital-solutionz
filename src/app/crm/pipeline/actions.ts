'use server';

import {
    PipelineServiceInstance,
} from '@/services/crm/PipelineService';

export async function getPipeline() {

    return PipelineServiceInstance.list();

}

export async function getPipelineSummary() {

    return PipelineServiceInstance.summary();

}

export async function moveOpportunity(
    id: string,
    stage: string,
) {

    return PipelineServiceInstance.moveOpportunity(
        id,
        stage as never,
    );

}