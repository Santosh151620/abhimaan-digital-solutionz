import type {
    Opportunity,
    OpportunitySummary,
} from '@/types/crm/Opportunities';


import {
    opportunitiesRepository,
} from '@/repositories/crm/OpportunitiesRepository';



class OpportunitiesService {


    async list(): Promise<Opportunity[]> {

        return opportunitiesRepository.list();

    }



    async details(
        id: string,
    ): Promise<Opportunity | null> {

        return opportunitiesRepository.details(
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


        const now =
            new Date().toISOString();


        const opportunity: Opportunity = {

            id:
                data.id ??
                crypto.randomUUID(),

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


        return opportunitiesRepository.create(
            opportunity,
        );

    }



    async update(
        id: string,
        data: Partial<Opportunity>,
    ): Promise<Opportunity | null> {

        return opportunitiesRepository.update(
            id,
            data,
        );

    }



    async delete(
        id: string,
    ): Promise<boolean> {

        return opportunitiesRepository.delete(
            id,
        );

    }



    async summary(): Promise<OpportunitySummary> {

        return opportunitiesRepository.summary();

    }


}



export const opportunitiesService =
    new OpportunitiesService();



/**
 * Backward compatibility alias.
 */
export const OpportunitiesServiceInstance =
    opportunitiesService;
