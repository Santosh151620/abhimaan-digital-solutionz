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
        ) as Opportunity[];

    }




    async details(
        id:string,
    ):Promise<Opportunity | null> {

        return super.findById(
            id,
        );

    }




    async create(
        data:Partial<Opportunity>,
    ):Promise<Opportunity> {


        const now =
            new Date()
                .toISOString();


        return super.create({

            ...data,


            id:
                data.id ??
                crypto.randomUUID(),


            entityType:
                "Opportunity",


            opportunityNumber:
                data.opportunityNumber ??
                `OPP-${Date.now()}`,


            name:
                data.name ??
                data.title ??
                "Untitled Opportunity",


            title:
                data.title ??
                data.name ??
                "Untitled Opportunity",


            stage:
                data.stage ??
                "New",


            status:
                data.status ??
                "Open",


            value:
                data.value ??
                0,


            probability:
                data.probability ??
                0,


            createdAt:
                data.createdAt ??
                now,


            updatedAt:
                now,

        });

    }




    async update(
        id:string,
        data:Partial<Opportunity>,
    ):Promise<Opportunity> {


        return super.update(

            id,

            {

                ...data,

                entityType:
                    "Opportunity",

                updatedAt:
                    new Date()
                        .toISOString(),

            },

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



        if(filters?.stage) {

            query =
                query.eq(
                    "stage",
                    filters.stage,
                );

        }



        if(filters?.status) {

            query =
                query.eq(
                    "status",
                    filters.status,
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
                        `name.ilike.%${filters.search}%`,
                        `title.ilike.%${filters.search}%`,
                        `opportunity_number.ilike.%${filters.search}%`,
                    ]
                    .join(","),

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
        ) as Opportunity[];

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
    supabase: SupabaseClient,
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

