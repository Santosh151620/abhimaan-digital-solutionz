import type {
    SupabaseClient,
} from "@supabase/supabase-js";


import {
    createClient,
} from "@/lib/supabase/server";


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



    async list():Promise<Opportunity[]> {

        return this.repository.list();

    }



    async details(
        id:string,
    ):Promise<Opportunity | null> {

        return this.repository.details(
            id,
        );

    }



    async get(
        id:string,
    ):Promise<Opportunity | null> {

        return this.details(
            id,
        );

    }



async create(
    data: Partial<Opportunity>,
): Promise<Opportunity> {


    return this.repository.create({

        ...data,


        entityType:
            "Opportunity",


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

    });

}



async update(
    id: string,
    data: Partial<Opportunity>,
): Promise<Opportunity> {


    return this.repository.update(

        id,

        {

            ...data,


            entityType:
                "Opportunity",

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





export function getOpportunitiesService(
    supabase:SupabaseClient,
) {

    return createOpportunitiesService(
        supabase,
    );

}




/**
 * Server-safe service facade.
 *
 * Existing consumers continue using:
 *
 * opportunitiesService
 * OpportunitiesServiceInstance
 *
 * without importing Supabase directly.
 */
export const opportunitiesService = {

    async list() {
        const service =
            await serverService();
        return service.list();
    },

    async details(
        id:string,
    ) {

        const service =
            await serverService();
        return service.details(
            id,
        );
    },

    async get(
        id:string,
    ) {

        const service =
            await serverService();
        return service.get(
            id,
        );
    },

    async create(
        data:Partial<Opportunity>,
    ) {

        const service =
            await serverService();
        return service.create(
            data,
        );
    },

    async update(
        id:string,
        data:Partial<Opportunity>,
    ) {

        const service =
            await serverService();
        return service.update(
            id,
            data,
        );
    },

    async delete(
        id:string,
    ) {

        const service =
            await serverService();
        return service.delete(
            id,
        );
    },

    async summary() {
        const service =
            await serverService();
        return service.summary();
    },
};

async function serverService() {

    return createOpportunitiesService(
        await createClient(),

    );
}
export const OpportunitiesServiceInstance =
    opportunitiesService;