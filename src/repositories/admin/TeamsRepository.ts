import {
    TenantContextManager,
} from "@/lib/tenant/tenantContext";

import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";

import type {
    Team,
} from "@/types/admin/Team";

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

export interface ITeamsRepository {
    findAll(): Promise<Team[]>;

    findById(
        id: string,
    ): Promise<Team | null>;

    findByCode(
        code: string,
    ): Promise<Team | null>;

    findByDepartment(
        departmentId: string,
    ): Promise<Team[]>;

    save(
        team: Partial<Team>,
    ): Promise<Team>;

    delete(
        id: string,
    ): Promise<void>;
}

export class TeamsRepository
    implements ITeamsRepository
{
    private async client() {
        return createSupabaseServerClient();
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
                "team_name",
                {
                    ascending: true,
                },
            );

        if (error) {
            throw error;
        }

        return (data ?? []).map(
            (row) =>
                this.mapTeam(
                    row as TeamRow,
                ),
        );
    }

    async findById(
        id: string,
    ): Promise<Team | null> {
        const normalizedId =
            id.trim();

        if (!normalizedId) {
            throw new Error(
                "Team id is required.",
            );
        }

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
                normalizedId,
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

    async findByCode(
        code: string,
    ): Promise<Team | null> {
        const normalizedCode =
            code.trim().toUpperCase();

        if (!normalizedCode) {
            throw new Error(
                "Team code is required.",
            );
        }

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
                "team_code",
                normalizedCode,
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

    async findByDepartment(
        departmentId: string,
    ): Promise<Team[]> {
        const normalizedDepartmentId =
            departmentId.trim();

        if (!normalizedDepartmentId) {
            throw new Error(
                "Department id is required.",
            );
        }

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
                "department_id",
                normalizedDepartmentId,
            )
            .order(
                "team_name",
                {
                    ascending: true,
                },
            );

        if (error) {
            throw error;
        }

        return (data ?? []).map(
            (row) =>
                this.mapTeam(
                    row as TeamRow,
                ),
        );
    }

    async save(
        team: Partial<Team>,
    ): Promise<Team> {
        const teamCode =
            team.teamCode
                ?.trim()
                .toUpperCase();

        const teamName =
            team.teamName?.trim();

        if (!teamCode) {
            throw new Error(
                "Team code is required.",
            );
        }

        if (!teamName) {
            throw new Error(
                "Team name is required.",
            );
        }

        const supabase =
            await this.client();

        const now =
            new Date().toISOString();

        const payload = {
            id: team.id,
            organization_id:
                this.organizationId,
            department_id:
                team.departmentId ?? null,
            team_code:
                teamCode,
            team_name:
                teamName,
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
            .select("*")
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
        const normalizedId =
            id.trim();

        if (!normalizedId) {
            throw new Error(
                "Team id is required.",
            );
        }

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
                normalizedId,
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
