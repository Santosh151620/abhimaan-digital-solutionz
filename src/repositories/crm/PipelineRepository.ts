import type {
    PipelineColumn,
    PipelineOpportunity,
    PipelineStage,
} from '@/types/crm/Pipeline';

import type {
    Opportunity,
    OpportunityStage,
} from '@/types/crm/Opportunities';

import {
    createClient,
} from '@/lib/supabase/server';

import {
    createOpportunitiesRepository,
} from './OpportunitiesRepository';


class PipelineRepository {


    private readonly stages: readonly PipelineStage[] = [

        {
            id: 'New',
            name: 'New',
            color: '#3B82F6',
            order: 1,
        },

        {
            id: 'Qualified',
            name: 'Qualified',
            color: '#06B6D4',
            order: 2,
        },

        {
            id: 'Proposal',
            name: 'Proposal',
            color: '#F59E0B',
            order: 3,
        },

        {
            id: 'Negotiation',
            name: 'Negotiation',
            color: '#8B5CF6',
            order: 4,
        },

        {
            id: 'Won',
            name: 'Won',
            color: '#22C55E',
            order: 5,
        },

        {
            id: 'Lost',
            name: 'Lost',
            color: '#EF4444',
            order: 6,
        },

    ];



    async getStages(): Promise<PipelineStage[]> {

        return [
            ...this.stages,
        ];

    }




    async getPipeline(): Promise<PipelineColumn[]> {


        const supabase =
            await createClient();

        const repository =
            createOpportunitiesRepository(
                supabase,
            );

        const opportunities =
            await repository.list();

        const items: PipelineOpportunity[] =

            opportunities.map(
                (
                    opportunity: Opportunity,
                ) => ({

                    id:
                        opportunity.id,

                    title:
                        opportunity.title ||
                        opportunity.name,

                    companyId:
                        opportunity.companyId
                        ??
                        '',

                    value:
                        opportunity.value,

                    probability:
                        opportunity.probability,

                    stage:
                        opportunity.stage,

                })
            );



        return this.stages.map(
            stage => {


                const stageItems =

                    items.filter(
                        item =>
                            item.stage === stage.id
                    );



                return {

                    stage,

                    opportunities:
                        stageItems,

                    totalValue:

                        stageItems.reduce(

                            (
                                total,
                                item
                            ) =>

                                total +
                                item.value,

                            0
                        ),

                };

            }
        );

    }





    async findByStage(
        stage: OpportunityStage,
    ): Promise<PipelineColumn | undefined> {


        const pipeline =
            await this.getPipeline();



        return pipeline.find(
            column =>
                column.stage.id === stage
        );

    }





    async summary() {


        const pipeline =
            await this.getPipeline();



        return {

            stages:
                pipeline.length,


            totalOpportunities:

                pipeline.reduce(

                    (
                        total,
                        column
                    ) =>
                        total +
                        column.opportunities.length,

                    0

                ),



            totalValue:

                pipeline.reduce(

                    (
                        total,
                        column
                    ) =>
                        total +
                        column.totalValue,

                    0

                ),



            weightedValue:

                pipeline.reduce(

                    (
                        total,
                        column
                    ) =>

                        total +

                        column.opportunities.reduce(

                            (
                                stageTotal,
                                opportunity
                            ) =>

                                stageTotal +

                                (
                                    opportunity.value *
                                    opportunity.probability /
                                    100
                                ),

                            0

                        ),

                    0

                ),

        };

    }


}



export const pipelineRepository =
    new PipelineRepository();



export const PipelineRepositoryInstance =
    pipelineRepository;

