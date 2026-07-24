'use server';


import {
    opportunitiesService,
} from '@/services/crm/OpportunitiesService';


import type {
    Opportunity,
} from '@/types/crm/Opportunities';



export async function getOpportunities() {

    return opportunitiesService.list();

}



export async function getOpportunitySummary() {

    return opportunitiesService.summary();

}



export async function getOpportunity(
    id: string,
) {

    return opportunitiesService.details(
        id,
    );

}



export async function createOpportunity(
    values: Opportunity,
) {

    return opportunitiesService.create(
        values,
    );

}



export async function updateOpportunity(
    id: string,
    values: Partial<Opportunity>,
) {

    return opportunitiesService.update(
        id,
        values,
    );

}



export async function deleteOpportunity(
    id: string,
) {

    return opportunitiesService.delete(
        id,
    );

}