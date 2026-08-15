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
    CompanySearchFilters,
    CompaniesSummary,
} from '@/types/crm/Companies';




type CompanyDbRow = {

    id: string;

    organization_id: string;

    company_code?: string | null;

    company_name: string;

    legal_name?: string | null;

    display_name?: string | null;

    industry_id?: string | null;

    website?: string | null;

    email?: string | null;

    phone?: string | null;

    employee_count?: number | null;

    annual_revenue?: number | null;

    status:
    | 'active'
    | 'inactive'
    | 'archived';

    description?: string | null;

    created_at: string;

    updated_at: string;

    deleted_at?: string | null;

};




export class CompaniesRepository
    extends BaseRepository<Company> {

    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            'companies',
        );

    }


    private mapStatusFromDb(
    status:
        | string
        | null
        | undefined,
): Company['status'] {

    switch(status){

        case "active":
            return "ACTIVE";

        case "inactive":
            return "INACTIVE";

        case "archived":
            return "ARCHIVED";

        case "prospect":
            return "PROSPECT";

        default:
            return "ACTIVE";
    }
}

private mapStatusToDb(
    status: Company['status'] | undefined,
):
    | "active"
    | "inactive"
    | "archived"
    | "prospect" {


    switch(status){

        case "INACTIVE":
            return "inactive";

        case "ARCHIVED":
            return "archived";

        case "PROSPECT":
            return "prospect";

        case "ACTIVE":
        default:
            return "active";

    }

}


    private mapFromDb(
        row: CompanyDbRow,
    ): Company {


        return {

            entityType:
                'Company',


            id:
                row.id,


            organizationId:
                row.organization_id,



            companyNumber:
                row.company_code
                ??
                undefined,


            name:
                row.company_name,



            legalName:
                row.legal_name
                ??
                undefined,



            industry:
                row.industry_id
                ??
                undefined,



            website:
                row.website
                ??
                undefined,



            phone:
                row.phone
                ??
                undefined,



            email:
                row.email
                ??
                undefined,



            status:
                this.mapStatusFromDb(
                    row.status,
                ),



            employees:
                row.employee_count
                ??
                undefined,



            annualRevenue:
                row.annual_revenue
                ??
                undefined,



            description:
                row.description
                ??
                undefined,

            deletedAt:
                row.deleted_at
                ??
                undefined,



            createdAt:
                row.created_at,



            updatedAt:
                row.updated_at,

        };

    }









    private mapToDb(
        data: Partial<Company>,
    ): Record<string, unknown> {


        const payload:
            Record<string, unknown> = {};



        if (data.name !== undefined) {

            payload.company_name =
                data.name;

        }



        if (data.companyNumber !== undefined) {

            payload.company_code =
                data.companyNumber;

        }



        if (data.legalName !== undefined) {

            payload.legal_name =
                data.legalName;

        }



        if (data.website !== undefined) {

            payload.website =
                data.website;

        }



        if (data.email !== undefined) {

            payload.email =
                data.email;

        }



        if (data.phone !== undefined) {

            payload.phone =
                data.phone;

        }



        if (data.employees !== undefined) {

            payload.employee_count =
                data.employees;

        }



        if (data.annualRevenue !== undefined) {

            payload.annual_revenue =
                data.annualRevenue;

        }



        if (data.description !== undefined) {

            payload.description =
                data.description;

        }



        if (data.status !== undefined) {

            payload.status =
                this.mapStatusToDb(
                    data.status,
                );

        }



        if (data.deletedAt !== undefined) {

            payload.deleted_at =
                data.deletedAt;

        }



        return payload;

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
                    this.organizationId,
                )

                .neq(
                    'status',
                    'archived',
                )

                .order(
                    'created_at',
                    {
                        ascending: false,
                    },
                );




        if (error) {

            throw error;

        }

        return (data as CompanyDbRow[] ?? [])
            .map((row) => this.mapFromDb(row));
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
                    this.organizationId,
                )

                .eq(
                    'status',
                    'archived',
                )

                .order(
                    'updated_at',
                    {
                        ascending: false,
                    },
                );




        if (error) {

            throw error;

        }




        return ((data ?? []) as CompanyDbRow[]).map(
                row =>
                    this.mapFromDb(row),
            );

    }








    async findById(
        id: string,
    ): Promise<Company | null> {


        const company =
            await super.findById(id);



        if (!company) {

            return null;

        }
        return this.mapFromDb(
            company as unknown as CompanyDbRow,
        );

    }









    async details(
        id: string,
    ): Promise<CompanyDetails | null> {


        const company =
            await this.findById(id);



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
        data: Partial<Company>,
    ): Promise<Company> {


        const payload =
            this.mapToDb({

                ...data,

                entityType:
                    'Company',

                status:
                    data.status
                    ??
                    'ACTIVE',

            });



        const created =
            await super.create(
                payload as Partial<Company>,
            );



        return this.mapFromDb(
            created as unknown as CompanyDbRow,
        );

    }
    async update(
        id: string,
        data: Partial<Company>,
    ): Promise<Company> {


        if (!id) {

            throw new Error(
                'Company id is required',
            );

        }



        const payload =
            this.mapToDb(data);



        const updated =
            await super.update(

                id,

                payload as Partial<Company>,

            );



        return this.mapFromDb(
            updated as unknown as CompanyDbRow,
        );

    }








    async delete(
        id: string,
    ): Promise<void> {


        await this.update(

            id,

            {

                status:
                    'ARCHIVED',

                deletedAt:
                    new Date()
                        .toISOString(),

            },

        );

    }









    async restore(
        id: string,
    ): Promise<boolean> {


        const existing =
            await this.findById(id);



        if (!existing) {

            return false;

        }



        await this.update(

            id,

            {

                status:
                    'ACTIVE',

                deletedAt:
                    undefined,

            },

        );



        return true;

    }









    async search(
        filters?: CompanySearchFilters,
    ): Promise<Company[]> {


        let query =
            this.tableRef()

                .select('*')

                .eq(
                    'organization_id',
                    this.organizationId,
                );





        if (filters?.status) {


            query =
                query.eq(

                    'status',

                    this.mapStatusToDb(
                        filters.status,
                    ),

                );

        }





        if (filters?.industry) {


            query =
                query.eq(

                    'industry_id',

                    filters.industry,

                );

        }





        if (filters?.search) {


            const keyword =
                filters.search.trim();



            if (keyword.length) {


                query =
                    query.or(

                        [

                            `company_name.ilike.%${keyword}%`,

                            `email.ilike.%${keyword}%`,

                            `website.ilike.%${keyword}%`,

                            `phone.ilike.%${keyword}%`,

                        ]
                            .join(','),

                    );

            }

        }





        const {
            data,
            error,
        } =
            await query.order(

                'created_at',

                {

                    ascending: false,

                },

            );




        if (error) {

            throw error;

        }





        return ((data ?? []) as CompanyDbRow[]).map(

                row =>

                    this.mapFromDb(row),

            );

    }









    async summary(): Promise<CompaniesSummary> {


        const companies =
            await this.list();



        return {


            total:
                companies.length,



            active:

                companies.filter(

                    company =>

                        company.status === 'ACTIVE',

                )
                    .length,



            inactive:

                companies.filter(

                    company =>

                        company.status === 'INACTIVE',

                )
                    .length,



            prospects:

                companies.filter(

                    company =>

                        company.status === 'PROSPECT',

                )
                    .length,



            archived:

                (

                    await this.listArchived()

                )
                    .length,

        };

    }









    private async loadContacts(
        companyId: string,
    ): Promise<CompanyContact[]> {


        const {
            data,
            error,
        } =
            await this.supabase

                .from('contacts')

                .select('*')

                .eq(

                    'company_id',

                    companyId,

                )

                .eq(

                    'organization_id',

                    this.organizationId,

                );




        if (error) {

            throw error;

        }



        return (

            data ?? []

        )
            .map(

                row => ({

                    id:
                        row.id,

                    firstName:
                        row.first_name,

                    lastName:
                        row.last_name,

                    name:
                        row.display_name
                        ??
                        `${row.first_name ?? ''} ${row.last_name ?? ''}`
                            .trim(),

                    email:
                        row.email,

                    phone:
                        row.phone,

                    role:
                        row.job_title,

                })

            );

    }









    private async loadOpportunities(
        companyId: string,
    ): Promise<CompanyOpportunity[]> {


        const {
            data,
            error,
        } =
            await this.supabase

                .from('opportunities')

                .select('*')

                .eq(

                    'company_id',

                    companyId,

                )

                .eq(

                    'organization_id',

                    this.organizationId,

                );




        if (error) {

            throw error;

        }




        return (

            data ?? []

        )
            .map(

                row => ({

                    id:
                        row.id,

                    title:
                        row.title,

                    value:
                        row.expected_revenue
                        ??
                        0,

                    currency:
                        row.currency,

                    stage:
                        row.status
                        ??
                        'open',

                    probability:
                        row.probability
                        ??
                        0,

                })

            );

    }









    private async loadActivities(
        companyId: string,
    ): Promise<CompanyActivity[]> {


        const {
            data,
            error,
        } =
            await this.supabase

                .from('activities')

                .select('*')

                .eq(

                    'entity_id',

                    companyId,

                )

                .eq(

                    'entity_type',

                    'Company',

                )

                .eq(

                    'organization_id',

                    this.organizationId,

                )

                .order(

                    'created_at',

                    {

                        ascending: false,

                    },

                );




        if (error) {

            throw error;

        }




        return (

            data ?? []

        )
            .map(

                row => ({

                    id:
                        row.id,

                    type:
                        row.type,

                    title:
                        row.title,

                    description:
                        row.description,

                    createdAt:
                        row.created_at,

                })

            );

    }


}

