import type {
    Company,
    CompanyDetails,
} from '@/types/crm/Companies';

const companies: CompanyDetails[] = [
    {
        id: '1',
        name: 'Acme Technologies',
        legalName: 'Acme Technologies Pvt Ltd',
        industry: 'Software',
        website: 'https://acme.test',
        phone: '+91 9876543210',
        email: 'hello@acme.test',

        status: 'ACTIVE',

        address: 'MG Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',

        employees: 120,
        annualRevenue: 5000000,

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

        contacts: [],
        opportunities: [],
        activities: [],
    },
];

export class CompaniesRepository {

    async list(): Promise<Company[]> {
        return companies;
    }

    async findById(
        id: string
    ): Promise<CompanyDetails | null> {
        return (
            companies.find(
                company => company.id === id
            ) ?? null
        );
    }

    async create(data: unknown) {
        return data;
    }

    async update(
        id: string,
        data: unknown
    ) {
        return {
            id,data,
                    };
    }

    async delete(id: string) {
        return true;
    }

}

export const CompaniesRepositoryInstance =
    new CompaniesRepository();