import type {
    Opportunity,
    OpportunitySummary,
} from '@/types/crm/Opportunities';


import {
    createOpportunitiesRepository,
} from '@/repositories/crm/OpportunitiesRepository';


import {
    createClient,
} from '@/lib/supabase/server';



class OpportunitiesService {


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
            id,
        );

    }




    async get(
        id: string,
    ): Promise<Opportunity | null> {


        return this.details(
            id,
        );

    }




    async create(
        data: Partial<Opportunity>,
    ): Promise<Opportunity> {


        const repository =
            await this.repository();



        const now =
            new Date()
                .toISOString();



        const opportunity: Opportunity = {


            id:
                data.id ??
                crypto.randomUUID(),



            entityType:
                'Opportunity',



            opportunityNumber:
                data.opportunityNumber ??
                `OPP-${Date.now()}`,



            name:
                data.name ??
                data.title ??
                'Untitled Opportunity',



            title:
                data.title ??
                data.name ??
                'Untitled Opportunity',



            description:
                data.description,



            companyId:
                data.companyId,



            contactId:
                data.contactId,



            leadId:
                data.leadId,



            ownerId:
                data.ownerId,



            owner:
                data.owner ??
                data.ownerId,



            stage:
                data.stage ??
                'New',



            status:
                data.status ??
                'Open',



            value:
                data.value ??
                0,



            probability:
                data.probability ??
                0,



            expectedCloseDate:
                data.expectedCloseDate,



            createdAt:
                data.createdAt ??
                now,



            updatedAt:
                now,

        };



        return repository.create(
            opportunity,
        );

    }




    async update(
        id: string,

        data: Partial<Opportunity>,

    ): Promise<Opportunity> {


        const repository =
            await this.repository();


        return repository.update(

            id,

            {

                ...data,

                entityType:
                    'Opportunity',

            },

        );

    }




    async delete(
        id: string,
    ): Promise<void> {


        const repository =
            await this.repository();


        await repository.delete(
            id,
        );

    }




    async summary(): Promise<OpportunitySummary> {


        const repository =
            await this.repository();


        return repository.summary();

    }


}




export const opportunitiesService =
    new OpportunitiesService();




/**
 * Backward compatibility alias.
 */
export const OpportunitiesServiceInstance =
    opportunitiesService;
