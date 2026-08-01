import type {
    SupabaseClient,
} from "@supabase/supabase-js";


import {
    BaseRepository,
} from "@/lib/db/base-repository";


import type {
    Opportunity,
    OpportunitySummary,
    OpportunitySearchFilters,
} from "@/types/crm/Opportunities";



export class OpportunitiesRepository
    extends BaseRepository<Opportunity> {



    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            "opportunities",
        );

    }





    private mapToDomain(
        row: Record<string, any>,
    ): Opportunity {

        return {

            id:
                row.id,


            entityType:
                "Opportunity",


            entityId:
                row.entity_id ??
                row.id,


            organizationId:
                row.organization_id,



            opportunityNumber:
                row.opportunity_number ??
                "",



            name:
                row.opportunity_name ??
                "Untitled Opportunity",



            title:
                row.opportunity_name ??
                "Untitled Opportunity",



            description:
                row.description ?? undefined,



            companyId:
                row.company_id ?? undefined,



            contactId:
                row.primary_contact_id ?? undefined,



            ownerId:
                row.owner_user_id ?? undefined,



            status:
                row.status ??
                "Open",



            stage:
                row.stage ??
                "New",



            value:
                Number(
                    row.amount ??
                    0,
                ),



            probability:
                Number(
                    row.probability ??
                    0,
                ),



            expectedCloseDate:
                row.expected_close_date ?? undefined,



            metadata:
                row.metadata ?? {},



            isDeleted:
                row.is_deleted ??
                false,



            deletedAt:
                row.deleted_at ?? null,



            createdAt:
                row.created_at,



            updatedAt:
                row.updated_at,

        };

    }






    async list(): Promise<Opportunity[]> {


        const {
            data,
            error,
        } =
            await this.tableRef()
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .order(
                    "created_at",
                    {
                        ascending:false,
                    },
                );



        if(error) {

            throw error;

        }



        return (

            data ?? []

        ).map(

            item =>
                this.mapToDomain(
                    item,
                ),

        );

    }







    async details(
        id:string,
    ):Promise<Opportunity | null> {


        const opportunity =
            await super.findById(
                id,
            );



        if(!opportunity) {

            return null;

        }



        return this.mapToDomain(
            opportunity as unknown as Record<string,any>,
        );

    }








    async create(
        data:Partial<Opportunity>,
    ):Promise<Opportunity> {


        const payload = {


            entity_type:
                "Opportunity",



            opportunity_number:
                data.opportunityNumber ??
                `OPP-${Date.now()}`,



            opportunity_name:
                data.name ??
                data.title ??
                "Untitled Opportunity",



            company_id:
                data.companyId ??
                null,



            primary_contact_id:
                data.contactId ??
                null,



            owner_user_id:
                data.ownerId ??
                null,



            stage:
                data.stage ??
                "New",



            status:
                data.status ??
                "Open",



            amount:
                data.value ??
                0,



            probability:
                data.probability ??
                0,



            expected_close_date:
                data.expectedCloseDate ??
                null,



            description:
                data.description ??
                null,



            metadata:
                data.metadata ??
                {},


        };



        const result =
            await super.create(
                payload as Partial<Opportunity>,
            );



        return this.mapToDomain(
            result as unknown as Record<string,any>,
        );

    }







    async update(
        id:string,
        data:Partial<Opportunity>,
    ):Promise<Opportunity> {


        const result =
            await super.update(

                id,

                {

                    opportunity_name:
                        data.name ??
                        data.title,


                    company_id:
                        data.companyId,


                    primary_contact_id:
                        data.contactId,


                    owner_user_id:
                        data.ownerId,


                    stage:
                        data.stage,


                    status:
                        data.status,


                    amount:
                        data.value,


                    probability:
                        data.probability,


                    expected_close_date:
                        data.expectedCloseDate,


                    description:
                        data.description,


                    metadata:
                        data.metadata,


                    updated_at:
                        new Date()
                            .toISOString(),

                } as Partial<Opportunity>,

            );



        return this.mapToDomain(
            result as unknown as Record<string,any>,
        );

    }








    async delete(
        id:string,
    ):Promise<void> {


        await this.update(

            id,

            {

                status:
                    "Lost",

            },

        );

    }








    async search(
        filters?:OpportunitySearchFilters,
    ):Promise<Opportunity[]> {


        let query =
            this.tableRef()
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                );



        if(filters?.status) {

            query =
                query.eq(
                    "status",
                    filters.status,
                );

        }



        if(filters?.stage) {

            query =
                query.eq(
                    "stage",
                    filters.stage,
                );

        }



        if(filters?.companyId) {

            query =
                query.eq(
                    "company_id",
                    filters.companyId,
                );

        }



        if(filters?.search) {


            query =
                query.or(

                    [

                        `opportunity_name.ilike.%${filters.search}%`,

                        `opportunity_number.ilike.%${filters.search}%`,

                    ].join(","),

                );

        }



        const {
            data,
            error,
        } =
            await query;



        if(error) {

            throw error;

        }



        return (

            data ?? []

        ).map(

            item =>
                this.mapToDomain(
                    item,
                ),

        );

    }








    async summary():Promise<OpportunitySummary> {


        const opportunities =
            await this.list();



        const totalValue =
            opportunities.reduce(

                (
                    sum,
                    item,
                ) =>

                    sum +
                    item.value,

                0,

            );



        return {


            total:
                opportunities.length,


            open:
                opportunities.filter(
                    item =>
                        item.status === "Open",
                ).length,


            won:
                opportunities.filter(
                    item =>
                        item.status === "Won",
                ).length,


            lost:
                opportunities.filter(
                    item =>
                        item.status === "Lost",
                ).length,


            pipelineValue:
                totalValue,


            weightedValue:
                opportunities.reduce(

                    (
                        sum,
                        item,
                    ) =>

                        sum +
                        (
                            item.value *
                            item.probability /
                            100
                        ),

                    0,

                ),


            totalValue,

        };

    }

}




export function createOpportunitiesRepository(
    supabase:SupabaseClient,
) {

    return new OpportunitiesRepository(
        supabase,
    );

}



/**
 * Backward compatibility aliases.
 */
export const opportunitiesRepository =
    createOpportunitiesRepository;


export const OpportunitiesRepositoryInstance =
    createOpportunitiesRepository;