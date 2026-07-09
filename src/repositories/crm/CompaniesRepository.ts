export class CompaniesRepository {

    async findAll() {
        return [];
    }

    async findById(..._args: unknown[]) {
        return null;
    }

}

export const CompaniesRepositoryInstance = new CompaniesRepository();