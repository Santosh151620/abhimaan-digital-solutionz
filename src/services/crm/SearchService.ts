import {
    SearchRepositoryInstance,
} from '@/repositories/crm/SearchRepository';

import type {
    SearchFilters,
    SearchResponse,
    SearchResult,
} from '@/types/crm/Search';

class SearchService {

    search(
        filters: SearchFilters
    ): SearchResponse {

        return SearchRepositoryInstance.search(
            filters
        );

    }

    create(
        data: SearchResult
    ): SearchResult {

        return SearchRepositoryInstance.create(
            data
        );

    }

    remove(
        id: string
    ): boolean {

        return SearchRepositoryInstance.remove(
            id
        );

    }

    clear(): void {

        SearchRepositoryInstance.clear();

    }

}

export const
    SearchServiceInstance =
        new SearchService();