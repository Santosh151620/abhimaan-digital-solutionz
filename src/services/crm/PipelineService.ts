import { PipelineRepositoryInstance } from '@/repositories/crm/PipelineRepository';
import type { OpportunityStage } from '@/types/crm/Opportunities';

export class PipelineService {

    async list() {
        return PipelineRepositoryInstance.list();
    }

    async moveOpportunity(
        id: string,
        stage: OpportunityStage
    ) {
        return PipelineRepositoryInstance.moveOpportunity(
            id, stage
        
        );
    }

    async summary() {
        return PipelineRepositoryInstance.summary();
    }

}

export const PipelineServiceInstance =
    new PipelineService();




