import type { OpportunityStage } from '@/types/crm/Opportunities';
import { OpportunitiesRepositoryInstance } from './OpportunitiesRepository';
import type {
    PipelineColumn,
    PipelineOpportunity,
    PipelineStage,
} from '@/types/crm/Pipeline';

export class PipelineRepository {

    private readonly stages: PipelineStage[] = [
        {
            id: 'lead',
            name: 'Lead',
            color: '#6B7280',
            order: 1,
        },
        {
            id: 'qualified',
            name: 'Qualified',
            color: '#2563EB',
            order: 2,
        },
        {
            id: 'proposal',
            name: 'Proposal',
            color: '#F59E0B',
            order: 3,
        },
        {
            id: 'negotiation',
            name: 'Negotiation',
            color: '#8B5CF6',
            order: 4,
        },
        {
            id: 'won',
            name: 'Won',
            color: '#16A34A',
            order: 5,
        },
    ];

    async list(): Promise<PipelineColumn[]> {

        const opportunities =
            await OpportunitiesRepositoryInstance.list();

        return this.stages.map(stage => {

            const items: PipelineOpportunity[] =
                opportunities
                    .filter(item => item.stage === stage.id)
                    .map(item => ({
                        id: item.id,
                        title: item.title,
                        companyId: item.companyId,
                        value: item.value,
                        probability: item.probability,
                        stage: item.stage,
                    }));

            return {
                stage,
                opportunities: items,
                totalValue: items.reduce(
                    (sum, item) => sum + item.value,
                    0
                ),
            };

        });

    }

    async moveOpportunity(
        id: string,
    stage: OpportunityStage
) {
    return OpportunitiesRepositoryInstance.update(
        id,
        { stage }
    );
}

    async summary() {

        const pipeline = await this.list();

        return {
            stages: pipeline.length,
            opportunities: pipeline.reduce(
                (sum, col) => sum + col.opportunities.length,
                0
            ),
            value: pipeline.reduce(
                (sum, col) => sum + col.totalValue,
                0
            ),
        };

    }

}

export const PipelineRepositoryInstance =
    new PipelineRepository();




