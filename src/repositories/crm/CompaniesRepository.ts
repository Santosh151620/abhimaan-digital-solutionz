import type {
    Company,
    CompanyDetails,
} from '@/types/crm/Companies';

const companies: CompanyDetails[] = [
    {
        id: '1',
        name: 'Abhimaan Digital Solutionz',
        legalName: 'Abhimaan Digital Solutionz Pvt Ltd',
        industry: 'IT Services',
        website: 'https://abhimaan.com',
        phone: '+91 9876543210',
        email: 'info@abhimaan.com',

        status: 'ACTIVE',

        address: 'Whitefield',
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',

        employees: 42,
        annualRevenue: 2500000,

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

        contacts: [
            {
                id: 'c1',
                name: 'Santosh',
                email: 'santosh@abhimaan.com',
                role: 'Founder',
            },
        ],

        opportunities: [
            {
                id: 'o1',
                title: 'CRM Implementation',
                value: 850000,
                stage: 'Proposal',
                probability: 70,
            },
        ],

        activities: [
            {
                id: 'a1',
                type: 'NOTE',
                title: 'Company created',
                createdAt: new Date().toISOString(),
            },
        ],
    },
];

export class CompaniesRepository {
    async list(): Promise<Company[]> {
        return companies;
    }

    async findById(id: string): Promise<CompanyDetails | null> {
        return companies.find((company) => company.id === id) ?? null;
    }

    async create(data: unknown) {
        return data;
    }

    async update(id: string, data: unknown) {
        void id;
        return data;
    }

    async delete(id: string) {
        void id;
        return true;
    }
}

export const CompaniesRepositoryInstance =
    new CompaniesRepository();