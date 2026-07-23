import type {
    SearchFilters,
    SearchResponse,
    SearchResult,
} from '@/types/crm/Search';

export class SearchRepository {

    private readonly items =
        new Map<string, SearchResult>();

    search(
        filters: SearchFilters
    ): SearchResponse {

        const query =
            filters.query
                .trim()
                .toLowerCase();

        let results =
            Array.from(
                this.items.values()
            );

        if (filters.entityType) {

            results =
                results.filter(
                    item =>
                        item.entityType ===
                        filters.entityType
                );

        }

        if (query.length > 0) {

            results =
                results.filter(item => {

                    return (

                        item.title
                            .toLowerCase()
                            .includes(query)

                        ||

                        item.subtitle
                            ?.toLowerCase()
                            .includes(query)

                        ||

                        item.description
                            ?.toLowerCase()
                            .includes(query)

                    );

                });

        }

        return {

            results,

            total:
                results.length,

        };

    }

    create(
        data: SearchResult
    ): SearchResult {

        this.items.set(
            data.id,
            data
        );

        return data;

    }

    remove(
        id: string
    ): boolean {

        return this.items.delete(
            id
        );

    }

    clear(): void {

        this.items.clear();

    }

}

export const
    SearchRepositoryInstance =
        new SearchRepository();