import {
    createClient,
} from "@/lib/supabase/server";


import {
    createOpportunitiesRepository,
} from "@/repositories/crm/OpportunitiesRepository";


import type {
    Opportunity,
    OpportunitySearchFilters,
    OpportunitySummary,
} from "@/types/crm/Opportunities";



export class OpportunitiesService {


    private async repository() {

        const supabase =
            await createClient();


        return createOpportunitiesRepository(
            supabase,
        );

    }



    async list(): Promise<Opportunity[]> {

        const repository =
            await this.repository();


        return repository.list();

    }



    async details(
        id: string,
    ): Promise<Opportunity | null> {

        const repository =
            await this.repository();


        return repository.details(
            this.requireId(id),
        );

    }



    async get(
        id: string,
    ): Promise<Opportunity | null> {

        return this.details(
            id,
        );

    }



    async search(
        filters?: OpportunitySearchFilters,
    ): Promise<Opportunity[]> {

        const repository =
            await this.repository();


        return repository.search(
            filters,
        );

    }



    async create(
        data: Partial<Opportunity>,
    ): Promise<Opportunity> {


        if (!data) {

            throw new Error(
                "Opportunity data is required.",
            );

        }



        const name =
            data.name?.trim()
            ??
            data.title?.trim();



        if (!name) {

            throw new Error(
                "Opportunity name is required.",
            );

        }



        const value =
            Number(
                data.value ?? 0,
            );



        if (value < 0) {

            throw new Error(
                "Opportunity value cannot be negative.",
            );

        }



        const probability =
            Number(
                data.probability ?? 0,
            );



        if (
            probability < 0 ||
            probability > 100
        ) {

            throw new Error(
                "Opportunity probability must be between 0 and 100.",
            );

        }



        const repository =
            await this.repository();



        return repository.create({

            ...data,

            name,

            title:
                name,


            entityType:
                "Opportunity",


            stage:
                data.stage
                ??
                "New",


            status:
                data.status
                ??
                "Open",


            value,

            probability,

        });

    }



    async update(
        id: string,
        data: Partial<Opportunity>,
    ): Promise<Opportunity> {


        const repository =
            await this.repository();



        return repository.update(

            this.requireId(id),

            {

                ...data,

                entityType:
                    "Opportunity",

            },

        );

    }



    async delete(
        id: string,
    ): Promise<void> {

        const repository =
            await this.repository();



        await repository.delete(
            this.requireId(id),
        );

    }



    async summary(): Promise<OpportunitySummary> {

        const repository =
            await this.repository();


        return repository.summary();

    }



    private requireId(
        id: string,
    ): string {

        const normalized =
            id?.trim();


        if (!normalized) {

            throw new Error(
                "Opportunity id is required.",
            );

        }


        return normalized;

    }

}



/**
 * Production factory
 */
export function createOpportunitiesService() {

    return new OpportunitiesService();

}



/**
 * Server-safe service facade
 */
export const opportunitiesService =
    new OpportunitiesService();



/**
 * Compatibility export
 */
export const OpportunitiesServiceInstance =
    opportunitiesService;