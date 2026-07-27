import {
    createClient,
} from '@/lib/supabase/server';

import {
    createOpportunitiesRepository,
} from '@/repositories/crm/OpportunitiesRepository';

import {
    pipelineRepository,
} from '@/repositories/crm/PipelineRepository';

import type {
    Opportunity,
    OpportunitySummary,
    OpportunityStage,
} from '@/types/crm/Opportunities';



class PipelineService {


    private async repository() {

        const supabase =
            await createClient();

        return createOpportunitiesRepository(
            supabase,
        );

    }




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




    async summary() {

        const pipeline =
            await this.getPipeline();

        const totalOpportunities =
            pipeline.reduce(

                (
                    total,
                    column,
                ) =>

                    total +
                    column.opportunities.length,

                0,

            );

        const totalValue =
            pipeline.reduce(

                (
                    total,
                    column,
                ) =>

                    total +
                    column.totalValue,

                0,

            );

        const weightedValue =
            pipeline.reduce(

                (
                    total,
                    column,
                ) =>

                    total +

                    column.opportunities.reduce(

                        (
                            stageTotal,
                            opportunity,
                        ) =>

                            stageTotal +

                            (
                                opportunity.value *
                                opportunity.probability /
                                100
                            ),

                        0,

                    ),

                0,

            );

        return {

            stages:
                pipeline.length,

            totalOpportunities,

            totalValue,

            weightedValue,

            // Backward compatibility

            total:
                totalOpportunities,

            pipelineValue:
                totalValue,

        };

    }




    async opportunitySummary(): Promise<OpportunitySummary> {

        const repository =
            await this.repository();

        return repository.summary();

    }




    async moveOpportunity(
        id: string,
        stage: OpportunityStage,
    ): Promise<Opportunity> {

        const repository =
            await this.repository();

        let status:
            'Open'
            | 'Won'
            | 'Lost'
            | 'On Hold';

        switch (stage) {

            case 'Won':

                status = 'Won';
                break;

            case 'Lost':

                status = 'Lost';
                break;

            default:

                status = 'Open';

        }

        return repository.update(

            id,

            {

                stage,

                status,

            },

        );

    }

}



export const pipelineService =
    new PipelineService();



/**
 * Backward compatibility alias.
 */
export const PipelineServiceInstance =
    pipelineService;
