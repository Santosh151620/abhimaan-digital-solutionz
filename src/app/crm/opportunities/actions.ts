'use server';


import {
    createOpportunitiesService,
} from '@/services/crm/OpportunitiesService';


import {
    createClient,
} from '@/lib/supabase/server';


import type {
    CreateOpportunityInput,
    UpdateOpportunityInput,
} from '@/types/crm/Opportunities';



async function service() {

    const supabase =
        await createClient();


    return createOpportunitiesService(
        supabase,
    );

}



export async function getOpportunities() {

    return (
        await service()
    ).list();

}



export async function getOpportunitySummary() {

    return (
        await service()
    ).summary();

}



export async function getOpportunity(
    id: string,
) {

    return (
        await service()
    ).details(
        id,
    );

}



export async function createOpportunity(
    values: CreateOpportunityInput,
) {

    return (
        await service()
    ).create(
        values,
    );

}



export async function updateOpportunity(
    id: string,
    values: UpdateOpportunityInput,
) {

    return (
        await service()
    ).update(

        id,

        values,

    );

}



export async function deleteOpportunity(
    id: string,
) {

    return (
        await service()
    ).delete(
        id,
    );

}