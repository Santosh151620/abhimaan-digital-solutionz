import type {
    SupabaseClient,
} from "@supabase/supabase-js";


import {
    createOpportunitiesRepository,
    OpportunitiesRepository,
} from "@/repositories/crm/OpportunitiesRepository";


import type {
    Opportunity,
    OpportunitySummary,
} from "@/types/crm/Opportunities";


export class OpportunitiesService {


    constructor(
        private readonly repository:
            OpportunitiesRepository,
    ) {}



    async list(): Promise<Opportunity[]> {

        return this.repository.list();

    }



    async details(
        id:string,
    ): Promise<Opportunity | null> {

        return this.repository.details(
            id,
        );

    }



    async get(
        id:string,
    ): Promise<Opportunity | null> {

        return this.details(
            id,
        );

    }



    async create(
        data:Partial<Opportunity>,
    ):Promise<Opportunity> {


        const now =
            new Date()
                .toISOString();


        return this.repository.create({

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


        return this.repository.update(

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

        return this.repository.delete(
            id,
        );

    }



    async summary():Promise<OpportunitySummary> {

        return this.repository.summary();

    }

}



export function createOpportunitiesService(
    supabase:SupabaseClient,
) {

    return new OpportunitiesService(

        createOpportunitiesRepository(
            supabase,
        ),

    );

}



/**
 * Legacy compatibility factory.
 *
 * Existing routes/pages still import:
 * OpportunitiesServiceInstance
 * opportunitiesService
 *
 * Keep these exports until all consumers
 * migrate to dependency injection.
 */
export function getOpportunitiesService(
    supabase:SupabaseClient,
) {

    return createOpportunitiesService(
        supabase,
    );

}


export const opportunitiesService = {

    async list() {

        const {
            createClient,
        } = await import(
            "@/lib/supabase/server"
        );


        return (
            await createOpportunitiesService(
                await createClient(),
            )
        ).list();

    },


    async details(
        id:string,
    ) {

        const {
            createClient,
        } = await import(
            "@/lib/supabase/server"
        );


        return (
            await createOpportunitiesService(
                await createClient(),
            )
        ).details(id);

    },


    async create(
        data:Partial<Opportunity>,
    ) {

        const {
            createClient,
        } = await import(
            "@/lib/supabase/server"
        );


        return (
            await createOpportunitiesService(
                await createClient(),
            )
        ).create(data);

    },


    async update(
        id:string,
        data:Partial<Opportunity>,
    ) {

        const {
            createClient,
        } = await import(
            "@/lib/supabase/server"
        );


        return (
            await createOpportunitiesService(
                await createClient(),
            )
        ).update(
            id,
            data,
        );

    },


    async delete(
        id:string,
    ) {

        const {
            createClient,
        } = await import(
            "@/lib/supabase/server"
        );


        return (
            await createOpportunitiesService(
                await createClient(),
            )
        ).delete(id);

    },


    async summary() {

        const {
            createClient,
        } = await import(
            "@/lib/supabase/server"
        );


        return (
            await createOpportunitiesService(
                await createClient(),
            )
        ).summary();

    },

};



export const OpportunitiesServiceInstance =
    opportunitiesService;