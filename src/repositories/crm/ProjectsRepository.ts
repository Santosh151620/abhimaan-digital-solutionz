import type { SupabaseClient } from "@supabase/supabase-js";

import { BaseRepository } from "@/lib/db/base-repository";

import type {
    Project,
} from "@/types/crm/Projects";


export class ProjectsRepository
    extends BaseRepository<Project> {

    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            "projects",
        );

    }


    async listArchived(): Promise<Project[]> {

        const {
            data,
            error,
        } =
            await this.tableRef()
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "archived",
                    true,
                )
                .order(
                    "updated_at",
                    {
                        ascending: false,
                    },
                );


        if (error) {
            throw error;
        }


        return (
            data ?? []
        ) as Project[];

    }



    async restore(
        id: string,
    ): Promise<boolean> {

        const {
            error,
        } =
            await this.tableRef()
                .update(
                    {
                        archived: false,

                        updated_at:
                            new Date()
                                .toISOString(),
                    },
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "id",
                    id,
                );


        if (error) {
            throw error;
        }


        return true;

    }

    async delete(
        id: string,
    ): Promise<void> {

        const {
            error,
        } =
            await this.tableRef()
                .update(
                    {
                        archived: true,

                        updated_at:
                            new Date()
                                .toISOString(),
                    },
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "id",
                    id,
                );


        if (error) {
            throw error;
        }

    }

    async summary() {

        const projects =
            await this.findAll();


        return {

            total:
                projects.length,


            planning:
                projects.filter(
                    project =>
                        project.status === "Planning",
                ).length,


            active:
                projects.filter(
                    project =>
                        project.status === "Active",
                ).length,


            onHold:
                projects.filter(
                    project =>
                        project.status === "On Hold",
                ).length,


            completed:
                projects.filter(
                    project =>
                        project.status === "Completed",
                ).length,


            cancelled:
                projects.filter(
                    project =>
                        project.status === "Cancelled",
                ).length,


            totalBudget:
                projects.reduce(
                    (
                        sum,
                        project,
                    ) =>
                        sum +
                        (
                            project.budget ?? 0
                        ),

                    0,
                ),

        };

    }

}