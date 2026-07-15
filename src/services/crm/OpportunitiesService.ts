import { OpportunitiesRepositoryInstance } from '@/repositories/crm/OpportunitiesRepository';
import type { Opportunity } from '@/types/crm/Opportunities';

export class OpportunitiesService {

    async list() {
        return OpportunitiesRepositoryInstance.list();
    }

    async listArchived() {
        return OpportunitiesRepositoryInstance.listArchived();
    }

    async details(id: string) {
        return OpportunitiesRepositoryInstance.findById(id);
    }

    async create(
        data: Partial<Opportunity>
    ) {
        return OpportunitiesRepositoryInstance.create(data);
    }

    async update(
        id: string,
        data: Partial<Opportunity>
    ) {
        return OpportunitiesRepositoryInstance.update(id, data);
    }

    async delete(id: string) {
        return OpportunitiesRepositoryInstance.delete(id);
    }

    async restore(id: string) {
        return OpportunitiesRepositoryInstance.restore(id);
    }

}

export const OpportunitiesServiceInstance =
    new OpportunitiesService();