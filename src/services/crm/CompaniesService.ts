import { CompaniesRepositoryInstance } from '@/repositories/crm/CompaniesRepository';

export class CompaniesService {

    async list() {
        return CompaniesRepositoryInstance.findAll();
    }

    async details(id: string) {
        return CompaniesRepositoryInstance.findById(id);
    }

}

export const CompaniesServiceInstance = new CompaniesService();
