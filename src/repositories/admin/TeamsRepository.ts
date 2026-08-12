import type { SupabaseClient } from "@supabase/supabase-js";

import { BaseRepository } from "@/lib/db/base-repository";

import type { Team } from "@/types/admin/Team";

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

interface ITeamsRepository {
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
    extends BaseRepository<Team>
    implements ITeamsRepository
{
    constructor(
        supabase: SupabaseClient,
    ) {
        super(
            supabase,
            "teams",
        );
    }

    async findAll(): Promise<Team[]> {
        const {
            data,
            error,
        } = await this
            .tableRef()
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
            this.requireValue(
                id,
                "Team id",
            );

        const {
            data,
            error,
        } = await this
            .tableRef()
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
            this.requireValue(
                code,
                "Team code",
            ).toUpperCase();

        const {
            data,
            error,
        } = await this
            .tableRef()
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
            this.requireValue(
                departmentId,
                "Department id",
            );

        const {
            data,
            error,
        } = await this
            .tableRef()
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
        if (!team) {
            throw new Error(
                "Team is required.",
            );
        }

        const teamCode =
            this.requireValue(
                team.teamCode,
                "Team code",
            ).toUpperCase();

        const teamName =
            this.requireValue(
                team.teamName,
                "Team name",
            );

        const now =
            new Date().toISOString();

        const payload: Record<
            string,
            unknown
        > = {
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

        if (team.id) {
            payload.id =
                team.id;
        }

        const {
            data,
            error,
        } = await this
            .tableRef()
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

        if (!data) {
            throw new Error(
                "Team save returned no data.",
            );
        }

        return this.mapTeam(
            data as TeamRow,
        );
    }

    async delete(
        id: string,
    ): Promise<void> {
        const normalizedId =
            this.requireValue(
                id,
                "Team id",
            );

        await super.delete(
            normalizedId,
        );
    }

    private requireValue(
        value: string | null | undefined,
        fieldName: string,
    ): string {
        const normalized =
            value?.trim();

        if (!normalized) {
            throw new Error(
                `${fieldName} is required.`,
            );
        }

        return normalized;
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
                row.department_id ??
                undefined,

            teamCode:
                row.team_code,

            teamName:
                row.team_name,

            description:
                row.description ??
                undefined,

            teamLeadId:
                row.team_lead_id ??
                undefined,

            status:
                row.status ??
                "Active",

            metadata:
                row.metadata ??
                {},

            createdAt:
                row.created_at,

            updatedAt:
                row.updated_at,
        };
    }
}