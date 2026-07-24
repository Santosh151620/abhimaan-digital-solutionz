import {
    pipelineRepository,
} from '@/repositories/crm/PipelineRepository';

import {
    opportunitiesRepository,
} from '@/repositories/crm/OpportunitiesRepository';

import type {
    Opportunity,
    OpportunitySummary,
    OpportunityStage,
} from '@/types/crm/Opportunities';



class PipelineService {


    async list() {

        return pipelineRepository.getPipeline();

    }



    async getPipeline() {

        return pipelineRepository.getPipeline();

    }



    async getStages() {

        return pipelineRepository.getStages();

    }



    async findByStage(
        stage: OpportunityStage,
    ) {

        return pipelineRepository.findByStage(
            stage,
        );

    }



    async summary(): Promise<OpportunitySummary> {

        return opportunitiesRepository.summary();

    }



    async moveOpportunity(
        id: string,
        stage: OpportunityStage,
    ): Promise<Opportunity | null> {

        return opportunitiesRepository.update(
            id,
            {
                stage,
            },
        );

    }

}



export const pipelineService =
    new PipelineService();



export const PipelineServiceInstance =
    pipelineService;