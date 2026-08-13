import {
    createClient,
} from '@/lib/supabase/server';


import {
    CompaniesRepository,
} from '@/repositories/crm/CompaniesRepository';


import type {
    Company,
    CompanyDetails,
    CompanySearchFilters,
    CompaniesSummary,
    CreateCompanyInput,
    UpdateCompanyInput,
} from '@/types/crm/Companies';



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
        id: string,
    ): Promise<Company | null> {


        if (!id) {

            throw new Error(
                'Company id is required'
            );

        }


        const repository =
            await this.repository();


        return repository.findById(
            id
        );

    }



    async details(
        id: string,
    ): Promise<CompanyDetails | null> {


        if (!id) {

            throw new Error(
                'Company id is required'
            );

        }


        const repository =
            await this.repository();


        return repository.details(
            id
        );

    }



    async search(
        filters?: CompanySearchFilters,
    ): Promise<Company[]> {

        const repository =
            await this.repository();


        return repository.search(
            filters
        );

    }



    async create(
        data: CreateCompanyInput,
    ): Promise<Company> {


        const name =
            data.name?.trim();


        if (!name) {

            throw new Error(
                'Company name is required'
            );

        }


        const repository =
            await this.repository();


        return repository.create({

            ...data,

            name,

            entityType:
                'Company',

        });

    }



    async update(
        id: string,

        data: UpdateCompanyInput,

    ): Promise<Company> {


        if (!id) {

            throw new Error(
                'Company id is required'
            );

        }


        if (
            Object.keys(data).length === 0
        ) {

            throw new Error(
                'Company update data is required'
            );

        }


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
        id: string,
    ): Promise<void> {


        if (!id) {

            throw new Error(
                'Company id is required'
            );

        }


        const repository =
            await this.repository();


        await repository.delete(
            id
        );

    }



    async archive(
        id: string,
    ): Promise<void> {

        await this.delete(
            id
        );

    }



    async restore(
        id: string,
    ): Promise<boolean> {


        if (!id) {

            throw new Error(
                'Company id is required'
            );

        }


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