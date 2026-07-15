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

        isDeleted: false,
        deletedAt: null,
        deletedBy: null,

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

        contacts: [],
        opportunities: [],
        activities: [],
    },
];

export class CompaniesRepository {

    async list(): Promise<Company[]> {
        return companies.filter(
            company => !company.isDeleted
        );
    }

    async listArchived(): Promise<Company[]> {
        return companies.filter(
            company => company.isDeleted
        );
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

    async create(
        data: Partial<CompanyDetails>
    ): Promise<CompanyDetails> {

        const company: CompanyDetails = {
            id: Date.now().toString(),

            name: data.name ?? '',

            legalName: data.legalName,
            industry: data.industry,
            website: data.website,
            phone: data.phone,
            email: data.email,

            status: data.status ?? 'ACTIVE',

            address: data.address,
            city: data.city,
            state: data.state,
            country: data.country,

            employees: data.employees,
            annualRevenue: data.annualRevenue,

            isDeleted: false,
            deletedAt: null,
            deletedBy: null,

            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),

            contacts: [],
            opportunities: [],
            activities: [],
        };

        companies.push(company);

        return company;
    }

    async update(
        id: string,
        data: Partial<CompanyDetails>
    ): Promise<CompanyDetails | null> {

        const company = companies.find(
            item => item.id === id
        );

        if (!company) {
            return null;
        }

        Object.assign(company, data);

        company.updatedAt =
            new Date().toISOString();

        return company;

    }

    async delete(
        _id: string,
        deletedBy = 'system'
    ): Promise<boolean> {

        const company = companies.find(
            item => item.id === _id
        );

        if (!company) {
            return false;
        }

        company.isDeleted = true;
        company.deletedAt =
            new Date().toISOString();
        company.deletedBy = deletedBy;
        company.status = 'ARCHIVED';

        return true;

    }

    async restore(
        _id: string
    ): Promise<boolean> {

        const company = companies.find(
            item => item.id === _id
        );

        if (!company) {
            return false;
        }

        company.isDeleted = false;
        company.deletedAt = null;
        company.deletedBy = null;

        if (company.status === 'ARCHIVED') {
            company.status = 'ACTIVE';
        }

        company.updatedAt =
            new Date().toISOString();

        return true;

    }

}

export const CompaniesRepositoryInstance =
    new CompaniesRepository();




