import type {
    SupabaseClient,
} from "@supabase/supabase-js";


import type {
    SearchFilters,
    SearchResponse,
    SearchResult,
} from "@/types/crm/Search";



export class SearchRepository {


    constructor(
        private readonly supabase: SupabaseClient,
    ) {}



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



        const organizationFilter =
            this.supabase;



        const companies =
            await organizationFilter
                .from("companies")
                .select(
                    "id, company_name",
                )
                .ilike(
                    "company_name",
                    `%${query}%`,
                );



        companies.data?.forEach(
            item => {

                results.push({

                    id:
                        item.id,

                    entityType:
                        "Company",

                    entityId:
                        item.id,

                    title:
                        item.company_name,

                    url:
                        `/crm/companies/${item.id}`,

                });

            },
        );



        const contacts =
            await this.supabase
                .from("contacts")
                .select(
                    "id, display_name",
                )
                .ilike(
                    "display_name",
                    `%${query}%`,
                );



        contacts.data?.forEach(
            item => {

                results.push({

                    id:
                        item.id,

                    entityType:
                        "Contact",

                    entityId:
                        item.id,

                    title:
                        item.display_name,

                    url:
                        `/crm/contacts/${item.id}`,

                });

            },
        );



        const leads =
            await this.supabase
                .from("leads")
                .select(
                    "id, title",
                )
                .ilike(
                    "title",
                    `%${query}%`,
                );



        leads.data?.forEach(
            item => {

                results.push({

                    id:
                        item.id,

                    entityType:
                        "Lead",

                    entityId:
                        item.id,

                    title:
                        item.title,

                    url:
                        `/crm/leads/${item.id}`,

                });

            },
        );



        const opportunities =
            await this.supabase
                .from("opportunities")
                .select(
                    "id, title",
                )
                .ilike(
                    "title",
                    `%${query}%`,
                );



        opportunities.data?.forEach(
            item => {

                results.push({

                    id:
                        item.id,

                    entityType:
                        "Opportunity",

                    entityId:
                        item.id,

                    title:
                        item.title,

                    url:
                        `/crm/opportunities/${item.id}`,

                });

            },
        );



        const projects =
            await this.supabase
                .from("projects")
                .select(
                    "id, project_name",
                )
                .ilike(
                    "project_name",
                    `%${query}%`,
                );



        projects.data?.forEach(
            item => {

                results.push({

                    id:
                        item.id,

                    entityType:
                        "Project",

                    entityId:
                        item.id,

                    title:
                        item.project_name,

                    url:
                        `/crm/projects/${item.id}`,

                });

            },
        );



        const tasks =
            await this.supabase
                .from("tasks")
                .select(
                    "id, title",
                )
                .ilike(
                    "title",
                    `%${query}%`,
                );



        tasks.data?.forEach(
            item => {

                results.push({

                    id:
                        item.id,

                    entityType:
                        "Task",

                    entityId:
                        item.id,

                    title:
                        item.title,

                    url:
                        `/crm/tasks/${item.id}`,

                });

            },
        );



        const activities =
            await this.supabase
                .from("activities")
                .select(
                    "id, subject",
                )
                .ilike(
                    "subject",
                    `%${query}%`,
                );



        activities.data?.forEach(
            item => {

                results.push({

                    id:
                        item.id,

                    entityType:
                        "Activity",

                    entityId:
                        item.id,

                    title:
                        item.subject
                        ?? "Activity",

                    url:
                        `/crm/activities/${item.id}`,

                });

            },
        );



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