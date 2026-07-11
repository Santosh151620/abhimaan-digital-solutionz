export class CompaniesRepository {

    async list() {
        return [];
    }

    async findById(_id: string) {
        return null;
    }

    async create(data: unknown) {
        return data;
    }

    async update(_id: string, data: unknown) {
        return data;
    }

    async delete(_id: string) {
        return true;
    }

}

export const CompaniesRepositoryInstance = new CompaniesRepository();
