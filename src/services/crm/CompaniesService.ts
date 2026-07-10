import { CompaniesRepositoryInstance } from '@/repositories/crm/CompaniesRepository';
import type { CompanyDetails } from '@/types/crm/Companies';

export class CompaniesService {

    async list() {
        return CompaniesRepositoryInstance.list();
    }

    async listArchived() {
        return CompaniesRepositoryInstance.listArchived();
    }

    async details(id: string) {
        return CompaniesRepositoryInstance.findById(id);
    }

    async create(
        data: Partial<CompanyDetails>
    ) {
        return CompaniesRepositoryInstance.create(data);
    }

    async update(
        id: string,
        data: Partial<CompanyDetails>
    ) {
        return CompaniesRepositoryInstance.update(id, data);
    }

    async delete(id: string) {
        return CompaniesRepositoryInstance.delete(id);
    }

    async restore(id: string) {
        return CompaniesRepositoryInstance.restore(id);
    }

}

export const CompaniesServiceInstance =
    new CompaniesService();