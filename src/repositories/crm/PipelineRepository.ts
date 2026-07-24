import type {
    PipelineColumn,
    PipelineOpportunity,
    PipelineStage,
} from '@/types/crm/Pipeline';

import type {
    OpportunityStage,
} from '@/types/crm/Opportunities';

import {
    OpportunitiesRepositoryInstance,
} from './OpportunitiesRepository';

class PipelineRepository {

    private readonly stages: PipelineStage[] = [

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

        return this.stages;

    }

    async getPipeline(): Promise<PipelineColumn[]> {

        const opportunities =
            await OpportunitiesRepositoryInstance.list();

        const items: PipelineOpportunity[] =

            opportunities.map(item => ({

                id: item.id,

                title: item.title ?? item.name,

                companyId: item.companyId ?? '',

                value: item.value,

                probability: item.probability,

                stage: item.stage,

            }));

        return this.stages.map(stage => {

            const stageItems =

                items.filter(

                    item => item.stage === stage.id,

                );

            return {

                stage,

                opportunities: stageItems,

                totalValue:

                    stageItems.reduce(

                        (sum, item) => sum + item.value,

                        0,

                    ),

            };

        });

    }

    async findByStage(

        stage: OpportunityStage,

    ): Promise<PipelineColumn | undefined> {

        const pipeline =

            await this.getPipeline();

        return pipeline.find(

            column => column.stage.id === stage,

        );

    }

}

export const pipelineRepository =
    new PipelineRepository();

export const PipelineRepositoryInstance =
    pipelineRepository;