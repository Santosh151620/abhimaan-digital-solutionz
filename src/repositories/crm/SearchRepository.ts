import type {
    SupabaseClient,
} from "@supabase/supabase-js";


import {
    TenantContextManager,
} from "@/lib/tenant/tenantContext";


import type {
    SearchFilters,
    SearchResponse,
    SearchResult,
} from "@/types/crm/Search";



export class SearchRepository {


    constructor(
        private readonly supabase: SupabaseClient,
    ) {}



    private get organizationId(): string {

        return TenantContextManager
            .require()
            .organizationId;

    }



private async executeSearch(
    table: string,
    column: string,
    entityType: SearchResult["entityType"],
    urlPrefix: string,
    titleField: string,
    query: string,
): Promise<SearchResult[]> {


    const {
        data,
        error,
    } =
        await this.supabase
            .from(table)
            .select("*")
            .eq(
                "organization_id",
                this.organizationId,
            )
            .ilike(
                column,
                `%${query}%`,
            );



    if (error) {

        throw error;

    }



    return (
        data ?? []
    ).map(
        (
            item:
                Record<string, unknown>,
        ) => ({

            id:
                String(
                    item.id,
                ),


            entityType,


            entityId:
                String(
                    item.id,
                ),


            title:
                String(
                    item[titleField]
                    ?? "",
                ),


            url:
                `${urlPrefix}/${item.id}`,


        }),
    );

}


    async search(
        filters: SearchFilters,
    ): Promise<SearchResponse> {


        const query =
            filters.query
                .trim()
                .toLowerCase();



        if (!query) {

            return {

                results: [],

                total: 0,

            };

        }

        const results: SearchResult[] = [];

        if (
            !filters.entityType
            ||
            filters.entityType === "Company"
        ) {

            results.push(
                ...await this.executeSearch(
                    "companies",
                    "company_name",
                    "Company",
                    "/crm/companies",
                    "company_name",
                    query,
                ),
            );

        }



        if (
            !filters.entityType
            ||
            filters.entityType === "Contact"
        ) {

            results.push(
                ...await this.executeSearch(
                    "contacts",
                    "display_name",
                    "Contact",
                    "/crm/contacts",
                    "display_name",
                    query,
                ),
            );

        }



        if (
            !filters.entityType
            ||
            filters.entityType === "Lead"
        ) {

            results.push(
                ...await this.executeSearch(
                    "leads",
                    "title",
                    "Lead",
                    "/crm/leads",
                    "title",
                    query,
                ),
            );

        }



        if (
            !filters.entityType
            ||
            filters.entityType === "Opportunity"
        ) {

            results.push(
                ...await this.executeSearch(
                    "opportunities",
                    "title",
                    "Opportunity",
                    "/crm/opportunities",
                    "title",
                    query,
                ),
            );

        }



        if (
            !filters.entityType
            ||
            filters.entityType === "Project"
        ) {

            results.push(
                ...await this.executeSearch(
                    "projects",
                    "project_name",
                    "Project",
                    "/crm/projects",
                    "project_name",
                    query,
                ),
            );

        }



        if (
            !filters.entityType
            ||
            filters.entityType === "Task"
        ) {

            results.push(
                ...await this.executeSearch(
                    "tasks",
                    "title",
                    "Task",
                    "/crm/tasks",
                    "title",
                    query,
                ),
            );

        }



        if (
            !filters.entityType
            ||
            filters.entityType === "Activity"
        ) {

            results.push(
                ...await this.executeSearch(
                    "activities",
                    "subject",
                    "Activity",
                    "/crm/activities",
                    "subject",
                    query,
                ),
            );

        }



        if (
            !filters.entityType
            ||
            filters.entityType === "Note"
        ) {

            results.push(
                ...await this.executeSearch(
                    "notes",
                    "title",
                    "Note",
                    "/crm/notes",
                    "title",
                    query,
                ),
            );

        }



        if (
            !filters.entityType
            ||
            filters.entityType === "Quotation"
        ) {

            results.push(
                ...await this.executeSearch(
                    "quotations",
                    "quotation_number",
                    "Quotation",
                    "/crm/quotations",
                    "quotation_number",
                    query,
                ),
            );

        }



        if (
            !filters.entityType
            ||
            filters.entityType === "Contract"
        ) {

            results.push(
                ...await this.executeSearch(
                    "contracts",
                    "contract_number",
                    "Contract",
                    "/crm/contracts",
                    "contract_number",
                    query,
                ),
            );

        }



        if (
            !filters.entityType
            ||
            filters.entityType === "Invoice"
        ) {

            results.push(
                ...await this.executeSearch(
                    "invoices",
                    "invoice_number",
                    "Invoice",
                    "/crm/invoices",
                    "invoice_number",
                    query,
                ),
            );

        }



        return {

            results,

            total:
                results.length,

        };

    }

}



export function createSearchRepository(
    supabase: SupabaseClient,
) {

    return new SearchRepository(
        supabase,
    );

}