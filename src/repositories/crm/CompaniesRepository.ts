import type {
    SupabaseClient,
} from '@supabase/supabase-js';

import {
    BaseRepository,
} from '@/lib/db/base-repository';

import type {
    Company,
    CompanyDetails,
    CompanyActivity,
    CompanyContact,
    CompanyOpportunity,
} from '@/types/crm/Companies';


interface CompanySearchFilters {

    status?: Company['status'];

    industry?: string;

    search?: string;

}



export class CompaniesRepository
    extends BaseRepository<Company> {


    constructor(
        supabase: SupabaseClient
    ) {

        super(
            supabase,
            'companies'
        );

    }



    async list(): Promise<Company[]> {

        const {
            data,
            error,
        } =
            await this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId
                )
                .neq(
                    'status',
                    'ARCHIVED'
                )
                .order(
                    'created_at',
                    {
                        ascending: false,
                    }
                );


        if (error) {

            throw error;

        }


        return (
            data ?? []
        ) as Company[];

    }



    async listArchived(): Promise<Company[]> {

        const {
            data,
            error,
        } =
            await this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId
                )
                .eq(
                    'status',
                    'ARCHIVED'
                )
                .order(
                    'updated_at',
                    {
                        ascending: false,
                    }
                );


        if (error) {

            throw error;

        }


        return (
            data ?? []
        ) as Company[];

    }



    async findById(
        id: string
    ): Promise<Company | null> {

        return super.findById(
            id
        );

    }



    async details(
        id: string
    ): Promise<CompanyDetails | null> {

        const company =
            await this.findById(
                id
            );


        if (!company) {

            return null;

        }


        const [
            contacts,
            opportunities,
            activities,
        ] =
            await Promise.all([

                this.loadContacts(id),

                this.loadOpportunities(id),

                this.loadActivities(id),

            ]);



        return {

            ...company,

            contacts,

            opportunities,

            activities,

        };

    }



    async create(
        data: Partial<Company>
    ): Promise<Company> {


        const payload: Partial<Company> = {

            ...data,

            entityType:
                'Company',

            status:
                data.status
                ??
                'ACTIVE',

        };


        return super.create(
            payload
        );

    }



    async update(
        id: string,

        data: Partial<Company>

    ): Promise<Company> {


        return super.update(

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


        await this.update(

            id,

            {

                status:
                    'ARCHIVED',

                deletedAt:
                    new Date()
                        .toISOString(),

            }

        );

    }
        async restore(
        id: string
    ): Promise<boolean> {


        const company =
            await this.findById(
                id
            );


        if (!company) {

            return false;

        }



        await this.update(

            id,

            {

                status:
                    'ACTIVE',

                deletedAt:
                    undefined,

            }

        );


        return true;

    }



    async search(
        filters?: CompanySearchFilters
    ): Promise<Company[]> {


        let query =
            this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId
                );



        if (filters?.status) {

            query =
                query.eq(
                    'status',
                    filters.status
                );

        }



        if (filters?.industry) {

            query =
                query.eq(
                    'industry',
                    filters.industry
                );

        }



        if (filters?.search) {

            const keyword =
                filters.search.trim();



            if (keyword.length > 0) {

                query =
                    query.or(

                        [
                            `name.ilike.%${keyword}%`,
                            `email.ilike.%${keyword}%`,
                            `website.ilike.%${keyword}%`,
                            `phone.ilike.%${keyword}%`,
                        ].join(',')

                    );

            }

        }



        const {
            data,
            error,
        } =
            await query
                .order(
                    'created_at',
                    {
                        ascending: false,
                    }
                );


        if (error) {

            throw error;

        }



        return (
            data ?? []
        ) as Company[];

    }



    async summary() {


        const companies =
            await this.list();



        return {

            total:
                companies.length,


            active:
                companies.filter(
                    company =>
                        company.status === 'ACTIVE'
                ).length,


            inactive:
                companies.filter(
                    company =>
                        company.status === 'INACTIVE'
                ).length,


            prospect:
                companies.filter(
                    company =>
                        company.status === 'PROSPECT'
                ).length,


            archived:
                companies.filter(
                    company =>
                        company.status === 'ARCHIVED'
                ).length,

        };

    }



    private async loadContacts(
        companyId: string
    ): Promise<CompanyContact[]> {


        const {
            data,
            error,
        } =
            await this.supabase
                .from('contacts')
                .select('*')
                .eq(
                    'entityType',
                    'Company'
                )
                .eq(
                    'entityId',
                    companyId
                )
                .eq(
                    'organization_id',
                    this.organizationId
                );



        if (error) {

            throw error;

        }



        return (
            data ?? []
        ) as CompanyContact[];

    }



    private async loadOpportunities(
        companyId: string
    ): Promise<CompanyOpportunity[]> {


        const {
            data,
            error,
        } =
            await this.supabase
                .from('opportunities')
                .select('*')
                .eq(
                    'entityType',
                    'Company'
                )
                .eq(
                    'entityId',
                    companyId
                )
                .eq(
                    'organization_id',
                    this.organizationId
                );



        if (error) {

            throw error;

        }



        return (
            data ?? []
        ) as CompanyOpportunity[];

    }
        private async loadActivities(
        companyId: string
    ): Promise<CompanyActivity[]> {


        const {
            data,
            error,
        } =
            await this.supabase
                .from('activities')
                .select('*')
                .eq(
                    'entityType',
                    'Company'
                )
                .eq(
                    'entityId',
                    companyId
                )
                .eq(
                    'organization_id',
                    this.organizationId
                )
                .order(
                    'created_at',
                    {
                        ascending: false,
                    }
                );



        if (error) {

            throw error;

        }



        return (
            data ?? []
        ) as CompanyActivity[];

    }


}