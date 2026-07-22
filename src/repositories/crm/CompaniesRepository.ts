import type {
    Company,
    CompanyDetails,
} from '@/types/crm/Companies';



class CompaniesRepository {


    private companies =
        new Map<string, CompanyDetails>();



    async list(): Promise<CompanyDetails[]> {

        return Array.from(
            this.companies.values()
        )
        .filter(
            company =>
                !company.isDeleted
        );

    }



    async listArchived(): Promise<CompanyDetails[]> {

        return Array.from(
            this.companies.values()
        )
        .filter(
            company =>
                company.isDeleted
        );

    }



    async findById(
        id: string
    ): Promise<CompanyDetails | null> {

        return (
            this.companies.get(id)
            ??
            null
        );

    }



    async details(
        id: string
    ): Promise<CompanyDetails | null> {

        return this.findById(id);

    }



    async create(
        data: Partial<CompanyDetails>
    ): Promise<CompanyDetails> {


        const now =
            new Date().toISOString();



        const company:CompanyDetails = {

            id:
                crypto.randomUUID(),


            organizationId:
                data.organizationId,


            companyNumber:
                data.companyNumber
                ??
                `CMP-${Date.now()}`,


            name:
                data.name
                ??
                '',


            legalName:
                data.legalName,


            industry:
                data.industry,


            website:
                data.website,


            phone:
                data.phone,


            email:
                data.email,


            status:
                data.status
                ??
                'ACTIVE',


            address:
                data.address,


            city:
                data.city,


            state:
                data.state,


            country:
                data.country,


            employees:
                data.employees,


            annualRevenue:
                data.annualRevenue,


            isDeleted:false,


            deletedAt:null,


            deletedBy:null,


            createdAt:now,


            updatedAt:now,


            contacts:
                data.contacts
                ??
                [],


            opportunities:
                data.opportunities
                ??
                [],


            activities:
                data.activities
                ??
                [],

        };



        this.companies.set(
            company.id,
            company
        );



        return company;

    }





    async update(
        id:string,
        data:Partial<CompanyDetails>
    ):Promise<CompanyDetails | null> {


        const existing =
            this.companies.get(id);



        if(!existing){

            return null;

        }



        const updated:CompanyDetails = {

            ...existing,

            ...data,


            updatedAt:
                new Date().toISOString(),

        };



        this.companies.set(
            id,
            updated
        );



        return updated;

    }





    async delete(
        id:string
    ):Promise<boolean>{


        const company =
            this.companies.get(id);



        if(!company){

            return false;

        }



        company.isDeleted = true;


        company.status =
            'ARCHIVED';


        company.deletedAt =
            new Date().toISOString();


        company.updatedAt =
            new Date().toISOString();



        this.companies.set(
            id,
            company
        );



        return true;

    }





    async restore(
        id:string
    ):Promise<boolean>{


        const company =
            this.companies.get(id);



        if(!company){

            return false;

        }



        company.isDeleted=false;


        company.deletedAt=null;


        company.deletedBy=null;



        if(
            company.status ===
            'ARCHIVED'
        ){

            company.status =
                'ACTIVE';

        }



        company.updatedAt =
            new Date().toISOString();



        this.companies.set(
            id,
            company
        );



        return true;

    }





    async search(
        filters?: {

            status?: Company['status'];

            industry?: string;

            search?: string;

        }

    ):Promise<CompanyDetails[]> {


        let companies =
            await this.list();



        if(filters?.status){

            companies =
                companies.filter(
                    company =>
                        company.status ===
                        filters.status
                );

        }



        if(filters?.industry){

            companies =
                companies.filter(
                    company =>
                        company.industry ===
                        filters.industry
                );

        }



        if(filters?.search){


            const keyword =
                filters.search.toLowerCase();



            companies =
                companies.filter(
                    company =>

                        company.name
                            .toLowerCase()
                            .includes(keyword)

                        ||

                        company.email
                            ?.toLowerCase()
                            .includes(keyword)

                );

        }



        return companies;

    }





    async summary(){


        const companies =
            await this.list();



        return {


            total:
                companies.length,


            active:
                companies.filter(
                    company =>
                        company.status ===
                        'ACTIVE'
                ).length,


            inactive:
                companies.filter(
                    company =>
                        company.status ===
                        'INACTIVE'
                ).length,


            prospect:
                companies.filter(
                    company =>
                        company.status ===
                        'PROSPECT'
                ).length,


        };

    }


}



export const CompaniesRepositoryInstance =
    new CompaniesRepository();