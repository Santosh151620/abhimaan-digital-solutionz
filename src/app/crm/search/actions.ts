'use server';

import {
    SearchServiceInstance,
} from '@/services/crm/SearchService';

import type {
    SearchResponse,
} from '@/types/crm/Search';

export async function searchAction(
    query: string
): Promise<SearchResponse> {

    return SearchServiceInstance.search({

        query,

    });

}