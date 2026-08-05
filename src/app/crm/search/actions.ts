'use server';

import {
    createClient,
} from '@/lib/supabase/server';

import {
    SearchService,
} from '@/services/crm/SearchService';

import type {
    SearchFilters,
    SearchResponse,
} from '@/types/crm/Search';

const EMPTY_RESPONSE: SearchResponse = {
    results: [],
    total: 0,
    page: 1,
    pageSize: 25,
    hasMore: false,
    executionTimeMs: 0,
};

export async function searchAction(
    filters: string | SearchFilters,
): Promise<SearchResponse> {

    const started =
        Date.now();

    try {

        const searchFilters: SearchFilters =
            typeof filters === 'string'
                ? {
                    query: filters.trim(),
                    page: 1,
                    pageSize: 25,
                }
                : {
                    page: 1,
                    pageSize: 25,
                    ...filters,
                    query:
                        filters.query.trim(),
                };

        if (!searchFilters.query) {

            return EMPTY_RESPONSE;

        }

        const supabase =
            await createClient();

        const service =
            new SearchService(
                supabase,
            );

        const response =
            await service.search(
                searchFilters,
            );

        return {

            ...response,

            executionTimeMs:
                Date.now() - started,

        };

    }

    catch (error) {

        console.error(
            '[CRM Search]',
            error,
        );

        return {

            ...EMPTY_RESPONSE,

            executionTimeMs:
                Date.now() - started,

        };

    }

}