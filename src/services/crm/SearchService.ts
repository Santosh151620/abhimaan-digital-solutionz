import type {
    SupabaseClient,
} from "@supabase/supabase-js";


import {
    createSearchRepository,
} from "@/repositories/crm/SearchRepository";


import type {
    SearchFilters,
    SearchResponse,
} from "@/types/crm/Search";



export class SearchService {


    private readonly repository;



    constructor(
        supabase: SupabaseClient,
    ) {

        this.repository =
            createSearchRepository(
                supabase,
            );

    }



    async search(
        filters: SearchFilters,
    ): Promise<SearchResponse> {


        return this.repository.search(
            filters,
        );

    }


}