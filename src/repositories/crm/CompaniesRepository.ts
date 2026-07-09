export class CompaniesRepository {

    async findAll() {
        return [];
    }

    async findById(id: string) {
        void id;
        return null;
    }

    async create(data: unknown) {
        void data;
        return { success: true };
    }

    async update(id: string, data: unknown) {
        void id;
        void data;
        return { success: true };
    }

    async delete(id: string) {
        void id;
        return { success: true };
    }

}

export const CompaniesRepositoryInstance = new CompaniesRepository();