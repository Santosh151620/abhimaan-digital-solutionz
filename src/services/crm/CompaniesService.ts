import {
    createClient,
} from '@/lib/supabase/server';

import {
    CompaniesRepository,
} from '@/repositories/crm/CompaniesRepository';

import type {
    Company,
    CompanyDetails,
} from '@/types/crm/Companies';



interface CompanySearchFilters {

    status?: Company['status'];

    industry?: string;

    search?: string;

}



interface CompaniesSummary {

    total: number;

    active: number;

    inactive: number;

    prospect: number;

    archived: number;

}



class CompaniesService {


    private async repository() {

        const supabase =
            await createClient();


        return new CompaniesRepository(
            supabase
        );

    }



    async list(): Promise<Company[]> {

        const repository =
            await this.repository();


        return repository.list();

    }



    async listArchived(): Promise<Company[]> {

        const repository =
            await this.repository();


        return repository.listArchived();

    }



    async findById(
        id: string
    ): Promise<Company | null> {

        const repository =
            await this.repository();


        return repository.findById(
            id
        );

    }



    async details(
        id: string
    ): Promise<CompanyDetails | null> {

        const repository =
            await this.repository();


        return repository.details(
            id
        );

    }



    async search(
        filters?: CompanySearchFilters
    ): Promise<Company[]> {

        const repository =
            await this.repository();


        return repository.search(
            filters
        );

    }



    async create(
        data: Partial<Company>
    ): Promise<Company> {

        const repository =
            await this.repository();


        return repository.create(
            {

                ...data,

                entityType:
                    'Company',

            }
        );

    }



    async update(
        id: string,

        data: Partial<Company>

    ): Promise<Company> {

        const repository =
            await this.repository();


        return repository.update(

            id,

            {

                ...data,

                entityType:
                    'Company',

            }

        );

    }
        async delete(
        id: string
    ): Promise<void> {

        const repository =
            await this.repository();


        await repository.delete(
            id
        );

    }



    async archive(
        id: string
    ): Promise<void> {

        return this.delete(
            id
        );

    }



    async restore(
        id: string
    ): Promise<boolean> {

        const repository =
            await this.repository();


        return repository.restore(
            id
        );

    }



    async summary(): Promise<CompaniesSummary> {

        const repository =
            await this.repository();


        return repository.summary();

    }


}



export const CompaniesServiceInstance =
    new CompaniesService();