import {
    NextRequest,
    NextResponse,
} from "next/server";


import {
    requireAdmin,
} from "@/lib/requireAdmin";


import {
    SearchService,
} from "@/services/crm/SearchService";


import type {
    SearchFilters,
} from "@/types/crm/Search";



export async function GET(
    request: NextRequest,
) {

    try {

        const {
            supabase,
        } =
            await requireAdmin();



        const { searchParams } =
            new URL(
                request.url,
            );



       const entityType =
    searchParams.get("entityType");


const filters: SearchFilters = {

    query:
        searchParams.get("query")
        ??
        "",


    entityType:
        entityType
            ? entityType as SearchFilters["entityType"]
            : undefined,


    page:
        Number(
            searchParams.get("page")
            ??
            1,
        ),


    pageSize:
        Number(
            searchParams.get("pageSize")
            ??
            25,
        ),

};



        const service =
            new SearchService(
                supabase,
            );



        const result =
            await service.search(
                filters,
            );



        return NextResponse.json(
            {
                data:
                    result,
            },
            {
                status:200,
            },
        );


    }

    catch(error) {


        console.error(
            "CRM Search API error:",
            error,
        );


        return NextResponse.json(

            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Search failed",
            },

            {
                status:500,
            },

        );

    }

}