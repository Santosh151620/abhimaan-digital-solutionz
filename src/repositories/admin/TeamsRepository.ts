import {
    TenantContextManager,
} from "@/lib/tenant/tenantContext";


import type {
    Team,
} from "@/types/admin/Team";


import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";



type TeamRow = {

    id: string;

    organization_id: string;

    department_id: string | null;

    team_code: string;

    team_name: string;

    description: string | null;

    team_lead_id: string | null;

    status: Team["status"] | null;

    metadata: Record<string, unknown> | null;

    created_at: string;

    updated_at: string;

};




export class TeamsRepository {



    private async client() {

        return await createSupabaseServerClient();

    }





    private get organizationId(): string {

        return TenantContextManager
            .require()
            .organizationId;

    }





    async findAll(): Promise<Team[]> {


        const supabase =
            await this.client();



        const {
            data,
            error,
        } = await supabase

            .from("teams")

            .select("*")

            .eq(
                "organization_id",
                this.organizationId,
            )

            .order(
                "created_at",
                {
                    ascending: false,
                },
            );



        if (error) {

            throw error;

        }



        return (data ?? []).map(

            row =>
                this.mapTeam(
                    row as TeamRow,
                ),

        );

    }





    async findById(
        id: string,
    ): Promise<Team | null> {


        const supabase =
            await this.client();



        const {
            data,
            error,
        } = await supabase

            .from("teams")

            .select("*")

            .eq(
                "organization_id",
                this.organizationId,
            )

            .eq(
                "id",
                id,
            )

            .maybeSingle();



        if (error) {

            throw error;

        }



        return data

            ? this.mapTeam(
                data as TeamRow,
            )

            : null;

    }





    async save(
        team: Partial<Team>,
    ): Promise<Team> {


        const supabase =
            await this.client();



        if (!team.teamCode?.trim()) {

            throw new Error(
                "Team code is required.",
            );

        }



        if (!team.teamName?.trim()) {

            throw new Error(
                "Team name is required.",
            );

        }



        const now =
            new Date().toISOString();



        const payload: Partial<TeamRow> = {


            id:
                team.id,


            organization_id:
                this.organizationId,


            department_id:
                team.departmentId ?? null,


            team_code:
                team.teamCode
                    .trim()
                    .toUpperCase(),


            team_name:
                team.teamName
                    .trim(),


            description:
                team.description ?? null,


            team_lead_id:
                team.teamLeadId ?? null,


            status:
                team.status ?? "Active",


            metadata:
                team.metadata ?? {},


            created_at:
                team.createdAt ?? now,


            updated_at:
                now,

        };





        const {
            data,
            error,
        } = await supabase

            .from("teams")

            .upsert(

                payload,

                {
                    onConflict: "id",
                },

            )

            .select()

            .single();





        if (error) {

            throw error;

        }



        return this.mapTeam(
            data as TeamRow,
        );

    }





    async delete(
        id: string,
    ): Promise<void> {


        const supabase =
            await this.client();



        const {
            error,
        } = await supabase

            .from("teams")

            .delete()

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





    private mapTeam(
        row: TeamRow,
    ): Team {


        return {


            id:
                row.id,


            organizationId:
                row.organization_id,


            departmentId:
                row.department_id,


            teamCode:
                row.team_code,


            teamName:
                row.team_name,


            description:
                row.description ?? null,


            teamLeadId:
                row.team_lead_id,


            status:
                row.status ?? "Active",


            metadata:
                row.metadata ?? {},


            createdAt:
                row.created_at,


            updatedAt:
                row.updated_at,

        };

    }

}