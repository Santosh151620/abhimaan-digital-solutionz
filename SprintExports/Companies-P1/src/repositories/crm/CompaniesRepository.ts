export class CompaniesRepository {

    async list() {
        return [];
    }

    async findById(id: string) {
        return null;
    }

    async create(data: unknown) {
        return data;
    }

    async update(id: string, data: unknown) {
        return data;
    }

    async delete(id: string) {
        return true;
    }

}

export const CompaniesRepositoryInstance = new CompaniesRepository();
