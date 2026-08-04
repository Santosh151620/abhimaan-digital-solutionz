'use server';


import {
    createClient,
} from "@/lib/supabase/server";


import {
    SearchService,
} from "@/services/crm/SearchService";


import type {
    SearchResponse,
} from "@/types/crm/Search";



export async function searchAction(
    query: string,
): Promise<SearchResponse> {


    const supabase =
        await createClient();



    const service =
        new SearchService(
            supabase,
        );



    return service.search({

        query,

    });

}