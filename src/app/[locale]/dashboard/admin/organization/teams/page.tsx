import type {
    SupabaseClient,
} from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

import {
    TeamsRepository,
} from "@/repositories/admin/TeamsRepository";

import {
    TeamsService,
} from "@/services/admin/TeamsService";

import TeamTable from "@/components/admin/teams/TeamTable";

import TeamDialog from "@/components/admin/teams/TeamDialog";

import type {
    Team,
} from "@/types/admin/Team";

import {
    revalidatePath,
} from "next/cache";


/**
 * ============================================================================
 * ADS CRM — ORGANIZATION ADMINISTRATION
 *
 * Teams Management
 *
 * Route:
 *
 * /[locale]/dashboard/admin/organization/teams
 *
 * Boundary:
 *
 * Customer Organization Administration
 *
 * Responsibilities:
 *
 * - Manage organization teams.
 * - Reuse existing admin contracts.
 * - Preserve organization isolation.
 *
 * Does NOT:
 *
 * - Manage ADS platform teams.
 * - Manage authentication.
 * - Control global RBAC.
 *
 * ============================================================================
 */


async function getTeams(
    supabase: SupabaseClient,
): Promise<Team[]> {

    const repository =
        new TeamsRepository(
            supabase,
        );


    const service =
        new TeamsService(
            repository,
        );


    return service.getAll();

}


async function refreshTeams() {

    "use server";


    revalidatePath(
        "/dashboard/admin/organization/teams",
    );

}


export default async function OrganizationTeamsPage() {

    const supabase =
        await createClient();


    const teams =
        await getTeams(
            supabase,
        );


    return (

        <main
            className="
                min-w-0
                space-y-8
                px-4
                py-6
                sm:px-6
                lg:px-8
            "
        >

            <header
                className="
                    rounded-2xl
                    border
                    border-border
                    bg-background
                    p-6
                "
            >

                <p
                    className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.2em]
                        text-primary
                    "
                >
                    Organization Administration
                </p>


                <h1
                    className="
                        mt-2
                        text-3xl
                        font-bold
                        text-foreground
                    "
                >
                    Teams
                </h1>


                <p
                    className="
                        mt-3
                        max-w-3xl
                        text-sm
                        leading-6
                        text-muted-foreground
                    "
                >
                    Manage departments,
                    team structure and
                    organization workforce grouping.
                </p>

            </header>


            <section
                className="
                    rounded-2xl
                    border
                    border-border
                    bg-background
                    p-6
                    space-y-6
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <div>

                        <h2
                            className="
                                text-xl
                                font-semibold
                                text-foreground
                            "
                        >
                            Organization Teams
                        </h2>


                        <p
                            className="
                                text-sm
                                text-muted-foreground
                            "
                        >
                            Configure teams within this organization.
                        </p>

                    </div>


                    <TeamDialog />

                </div>


                <TeamTable
                    items={
                        teams
                    }
                />


            </section>


        </main>

    );

}