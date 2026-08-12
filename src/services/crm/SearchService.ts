import type {
    SupabaseClient,
} from "@supabase/supabase-js";

import {
    createSearchRepository,
    SearchRepository,
} from "@/repositories/crm/SearchRepository";

import type {
    SearchFilters,
    SearchResponse,
    SearchResult,
} from "@/types/crm/Search";

export class SearchService {

    private readonly repository?: SearchRepository;

    constructor(
        supabase?: SupabaseClient,
    ) {

        if (supabase) {

            this.repository =
                createSearchRepository(
                    supabase,
                );

        }

    }

    async search(
        filters: SearchFilters,
    ): Promise<SearchResponse> {

        if (!this.repository) {

            throw new Error(
                "SearchService requires a Supabase client.",
            );

        }

        const page =
            Math.max(
                1,
                filters.page ?? 1,
            );

        const pageSize =
            Math.min(
                Math.max(
                    1,
                    filters.pageSize
                    ??
                    filters.limit
                    ??
                    25,
                ),
                100,
            );

        const normalizedFilters: SearchFilters = {

            ...filters,

            query:
                filters.query
                    .trim()
                    .toLowerCase(),

            page,

            pageSize,

            limit: pageSize,

            offset:
                (page - 1)
                * pageSize,

        };

        if (
            normalizedFilters.query.length < 2
        ) {

            return {

                results: [],

                total: 0,

                page,

                pageSize,

                hasMore: false,

            };

        }

        let results: SearchResult[] = [];

        try {

            const response =
                await this.repository.search(
                    normalizedFilters,
                );

            results =
                [...response.results];

        }

        catch (error) {

            console.error(
                "Global search failed",
                error,
            );

            return {

                results: [],

                total: 0,

                page,

                pageSize,

                hasMore: false,

            };

        }

        const unique =
            new Map<
                string,
                SearchResult
            >();

        for (
            const result
            of results
        ) {

            const key =
                `${result.entityType}:${result.entityId}`;

            const existing =
                unique.get(
                    key,
                );

            if (

                !existing

                ||

                (
                    result.score ?? 0
                )

                >

                (
                    existing.score ?? 0
                )

            ) {

                unique.set(
                    key,
                    result,
                );

            }

        }

        const deduplicated =
            Array.from(
                unique.values(),
            );

        deduplicated.sort(

            (
                a,
                b,
            ) => {

                const score =
                    (b.score ?? 0)
                    -
                    (a.score ?? 0);

                if (
                    score !== 0
                ) {

                    return score;

                }

                return a.title.localeCompare(
                    b.title,
                );

            },

        );

        const total =
            deduplicated.length;

        const start =
            (page - 1)
            *
            pageSize;

        const end =
            start
            +
            pageSize;

        return {

            results:
                deduplicated.slice(
                    start,
                    end,
                ),

            total,

            page,

            pageSize,

            hasMore:
                end < total,

        };

    }

}

/**
 * Singleton for CRM orchestration.
 *
 * Repository-backed methods require
 * dependency injection via:
 *
 * new SearchService(supabase)
 */
const SearchServiceInstance =
    new SearchService();