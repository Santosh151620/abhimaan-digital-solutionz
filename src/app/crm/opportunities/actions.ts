'use server';

import {
    opportunitiesService,
} from '@/services/crm/OpportunitiesService';

import type {
    CreateOpportunityInput,
    UpdateOpportunityInput,
} from '@/types/crm/Opportunities';


function requireId(
    id: string,
): string {

    const normalized =
        id?.trim();


    if (!normalized) {

        throw new Error(
            'Opportunity id is required.',
        );

    }


    return normalized;

}


export async function getOpportunities() {

    return opportunitiesService.list();

}


export async function getOpportunitySummary() {

    return opportunitiesService.summary();

}


async function getOpportunity(
    id: string,
) {

    return opportunitiesService.details(
        requireId(id),
    );

}


export async function createOpportunity(
    values: CreateOpportunityInput,
) {

    if (
        !values ||
        typeof values !== 'object'
    ) {

        throw new Error(
            'Invalid opportunity data.',
        );

    }


    const name =
        values.name?.trim()
        ||
        values.title?.trim();


    if (!name) {

        throw new Error(
            'Opportunity name is required.',
        );

    }


    return opportunitiesService.create({

        ...values,

        name,

    });

}


export async function updateOpportunity(
    id: string,
    values: UpdateOpportunityInput,
) {

    const normalizedId =
        requireId(id);


    if (
        !values ||
        typeof values !== 'object'
    ) {

        throw new Error(
            'Invalid opportunity data.',
        );

    }


    return opportunitiesService.update(

        normalizedId,

        values,

    );

}


async function deleteOpportunity(
    id: string,
) {

    return opportunitiesService.delete(
        requireId(id),
    );

}
