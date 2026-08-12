"use server";

import {
    PipelineServiceInstance,
} from "@/services/crm/PipelineService";

import type {
    OpportunityStage,
} from "@/types/crm/Opportunities";

import type {
    PipelineSummary,
} from "@/types/crm/Pipeline";


export async function getPipeline() {
    return PipelineServiceInstance.getPipeline();
}


async function getPipelineStages() {
    return PipelineServiceInstance.getStages();
}


export async function getPipelineSummary(): Promise<PipelineSummary> {
    return PipelineServiceInstance.summary();
}


async function moveOpportunity(
    id: string,
    stage: OpportunityStage,
) {
    const normalizedId = id?.trim();

    if (!normalizedId) {
        throw new Error(
            "Opportunity id is required.",
        );
    }

    return PipelineServiceInstance.moveOpportunity(
        normalizedId,
        stage,
    );
}