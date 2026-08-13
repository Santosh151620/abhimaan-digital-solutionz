/**
 * ============================================================================
 * ADS ENTERPRISE PLATFORM
 *
 * Roles Repository
 *
 * Responsibilities:
 * - Tenant-scoped RBAC role registry
 * - Role lookup and persistence
 * - Role code normalization
 * - Permission ID normalization
 * - System-role protection
 * - Role status / hierarchy normalization
 * - Database row -> domain model mapping
 *
 * Database:
 * - roles
 *
 * Security:
 * - Every tenant query is organization scoped
 * - organization_id is always supplied from TenantContextManager
 * - System roles cannot be deleted
 * - Role IDs are validated before persistence operations
 * ============================================================================
 */

import {
    TenantContextManager,
} from "@/lib/tenant/tenantContext";

import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";

import type {
    Role,
} from "@/types/admin/Role";


type RoleRow = {
    id: string;

    organization_id: string | null;

    name: string;

    code: string;

    description: string | null;

    type: string | null;

    level: string | null;

    status: string | null;

    permission_ids: string[] | null;

    is_system: boolean | null;

    is_default: boolean | null;

    is_active: boolean | null;

    metadata:
        Record<string, unknown> | null;

    created_at: string;

    updated_at: string;
};


export interface IRolesRepository {

    list(): Promise<Role[]>;

    active(): Promise<Role[]>;

    findById(
        id: string,
    ): Promise<Role | null>;

    findByCode(
        code: string,
    ): Promise<Role | null>;

    save(
        role: Partial<Role>,
    ): Promise<Role>;

    delete(
        id: string,
    ): Promise<void>;
}


export class RolesRepository
    implements IRolesRepository
{

    private async client() {

        return createSupabaseServerClient();

    }


    private get organizationId(): string {

        return TenantContextManager
            .require()
            .organizationId;

    }


    async list():

    Promise<Role[]> {

        const supabase =
            await this.client();


        const {
            data,
            error,
        } = await supabase

            .from("roles")

            .select("*")

            .eq(
                "organization_id",
                this.organizationId,
            )

            .order(
                "name",
                {
                    ascending: true,
                },
            );


        if (error) {

            throw error;

        }


        return (data ?? []).map(
            (row) =>
                this.mapRole(
                    row as RoleRow,
                ),
        );

    }


    async active():

    Promise<Role[]> {

        const supabase =
            await this.client();


        const {
            data,
            error,
        } = await supabase

            .from("roles")

            .select("*")

            .eq(
                "organization_id",
                this.organizationId,
            )

            .eq(
                "is_active",
                true,
            )

            .order(
                "name",
                {
                    ascending: true,
                },
            );


        if (error) {

            throw error;

        }


        return (data ?? []).map(
            (row) =>
                this.mapRole(
                    row as RoleRow,
                ),
        );

    }


    async findById(

        id: string,

    ):

    Promise<Role | null> {

        const normalizedId =
            this.normalizeId(
                id,
            );


        const supabase =
            await this.client();


        const {
            data,
            error,
        } = await supabase

            .from("roles")

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
            ? this.mapRole(
                  data as RoleRow,
              )
            : null;

    }


    async findByCode(

        code: string,

    ):

    Promise<Role | null> {

        const normalizedCode =
            this.normalizeCode(
                code,
            );


        const supabase =
            await this.client();


        const {
            data,
            error,
        } = await supabase

            .from("roles")

            .select("*")

            .eq(
                "organization_id",
                this.organizationId,
            )

            .eq(
                "code",
                normalizedCode,
            )

            .maybeSingle();


        if (error) {

            throw error;

        }


        return data
            ? this.mapRole(
                  data as RoleRow,
              )
            : null;

    }


    async save(

        role: Partial<Role>,

    ):

    Promise<Role> {

        if (!role) {

            throw new Error(
                "Role is required.",
            );

        }


        const name =
            this.normalizeName(
                role.name,
            );


        const code =
            this.normalizeCode(
                role.code,
            );


        const supabase =
            await this.client();


        const now =
            new Date().toISOString();


        const permissionIds =
            this.normalizePermissionIds(
                role.permissionIds,
            );


        const payload = {

            id:
                role.id ??
                crypto.randomUUID(),

            organization_id:
                this.organizationId,

            name,

            code,

            description:
                role.description
                    ?.trim()
                || null,

            type:
                this.resolveType(
                    role.type,
                ),

            level:
                this.resolveLevel(
                    role.level ??
                    null,
                ),

            status:
                this.resolveStatus(
                    role.status,
                ),

            permission_ids:
                permissionIds,

            is_system:
                role.isSystem ??
                false,

            is_default:
                role.isDefault ??
                false,

            is_active:
                role.isActive ??
                true,

            metadata:
                role.metadata ??
                {},

            created_at:
                role.createdAt ??
                now,

            updated_at:
                now,

        };


        const {
            data,
            error,
        } = await supabase

            .from("roles")

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


        return this.mapRole(
            data as RoleRow,
        );

    }


    async delete(

        id: string,

    ):

    Promise<void> {

        const normalizedId =
            this.normalizeId(
                id,
            );


        const supabase =
            await this.client();


        const {
            data,
            error,
        } = await supabase

            .from("roles")

            .select(
                "id,is_system",
            )

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


        if (!data) {

            return;

        }


        if (
            data.is_system === true
        ) {

            throw new Error(
                "System roles cannot be deleted.",
            );

        }


        const {
            error: deleteError,
        } = await supabase

            .from("roles")

            .delete()

            .eq(
                "organization_id",
                this.organizationId,
            )

            .eq(
                "id",
                normalizedId,
            )

            .eq(
                "is_system",
                false,
            );


        if (deleteError) {

            throw deleteError;

        }

    }


    private normalizeId(

        id: string,

    ): string {

        const normalized =
            typeof id === "string"
                ? id.trim()
                : "";


        if (!normalized) {

            throw new Error(
                "Role id is required.",
            );

        }


        return normalized;

    }


    private normalizeName(

        name: string | undefined,

    ): string {

        const normalized =
            typeof name === "string"
                ? name.trim()
                : "";


        if (!normalized) {

            throw new Error(
                "Role name is required.",
            );

        }


        return normalized;

    }


    private normalizeCode(

        code: string | undefined,

    ): string {

        const normalized =
            typeof code === "string"
                ? code.trim().toLowerCase()
                : "";


        if (!normalized) {

            throw new Error(
                "Role code is required.",
            );

        }


        return normalized;

    }


    private normalizePermissionIds(

        permissionIds:
            string[] | undefined,

    ): string[] {

        return Array.from(

            new Set(

                (permissionIds ?? [])

                    .map(
                        (
                            permissionId,
                        ) =>
                            typeof permissionId ===
                            "string"
                                ? permissionId.trim()
                                : "",
                    )

                    .filter(
                        (
                            permissionId,
                        ): permissionId is string =>
                            Boolean(
                                permissionId,
                            ),
                    ),

            ),

        );

    }


    private resolveType(

        value:
            Role["type"] | undefined,

    ): Role["type"] {

        return (
            value ??
            "Custom"
        );

    }


    private resolveLevel(

        value: string | null,

    ): Role["level"] {

        switch (
            value
                ?.trim()
                .toUpperCase()
        ) {

            case "PLATFORM":

            case "PLATFORM_OWNER":

                return "Platform";


            case "APPLICATION":

            case "APPLICATION_ADMIN":

                return "Application";


            case "ORGANIZATION":

            case "ORGANIZATION_ADMIN":

            case "ORG_ADMIN":

                return "Organization";


            case "DEPARTMENT":

            case "DEPARTMENT_ADMIN":

                return "Department";


            case "TEAM":

            case "TEAM_LEAD":

                return "Team";


            default:

                return "Organization";

        }

    }


    private resolveStatus(

        value:
            Role["status"] | undefined,

    ): Role["status"] {

        return (
            value ??
            "Active"
        );

    }


    private mapRole(

        row: RoleRow,

    ): Role {

        return {

            id:
                row.id,

            organizationId:
                row.organization_id ??
                "",

            name:
                row.name,

            code:
                row.code,

            description:
                row.description ??
                undefined,

            type:
                this.resolveType(
                    row.type as Role["type"],
                ),

            level:
                this.resolveLevel(
                    row.level,
                ),

            status:
                this.resolveStatus(
                    row.status as Role["status"],
                ),

            permissionIds:
                row.permission_ids ??
                [],

            isSystem:
                row.is_system ??
                false,

            isDefault:
                row.is_default ??
                false,

            isActive:
                row.is_active ??
                false,

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