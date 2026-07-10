import { CompaniesRepositoryInstance } from '@/repositories/crm/CompaniesRepository';

export class CompaniesService {
    async list() {
        return CompaniesRepositoryInstance.list();
    }

    async details(id: string) {
        return CompaniesRepositoryInstance.findById(id);
    }

    async create(data: unknown) {
        return CompaniesRepositoryInstance.create(data);
    }

    async update(id: string, data: unknown) {
        return CompaniesRepositoryInstance.update(id, data);
    }

    async delete(id: string) {
        return CompaniesRepositoryInstance.delete(id);
    }
}

export const CompaniesServiceInstance = new CompaniesService();