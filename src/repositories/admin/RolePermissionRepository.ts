/**
 * ============================================================================
 * ADS Role Permission Repository
 * Production RBAC Repository
 *
 * Responsibilities:
 * - Tenant-scoped role/permission assignments.
 * - Safe assignment and revocation.
 * - Atomic-by-operation replacement semantics.
 * - Input validation and duplicate prevention.
 * ============================================================================
 */

import type {
    SupabaseClient,
} from "@supabase/supabase-js";

import {
    BaseRepository,
} from "@/lib/db/base-repository";

import type {
    RolePermission,
} from "@/types/admin/RolePermission";


type RolePermissionRow = {

    id: string;

    organization_id: string;

    role_id: string;

    permission_id: string;

    created_at: string;

    updated_at: string;

};


export interface IRolePermissionRepository {

    listByRole(
        roleId: string,
    ): Promise<RolePermission[]>;

    assign(
        roleId: string,
        permissionId: string,
    ): Promise<void>;

    revoke(
        roleId: string,
        permissionId: string,
    ): Promise<void>;

    replace(
        roleId: string,
        permissionIds: string[],
    ): Promise<void>;

}


export class RolePermissionRepository
    extends BaseRepository<RolePermission>
    implements IRolePermissionRepository {

    constructor(
        supabase: SupabaseClient,
    ) {
        super(
            supabase,
            "admin_role_permissions",
        );
    }


    async listByRole(
        roleId: string,
    ): Promise<RolePermission[]> {

        const normalizedRoleId =
            this.requireId(
                roleId,
                "Role id",
            );

        const {
            data,
            error,
        } =
            await this
                .tableRef()
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "role_id",
                    normalizedRoleId,
                )
                .order(
                    "created_at",
                    {
                        ascending: true,
                    },
                );

        if (error) {
            throw error;
        }

        return (data ?? []).map(
            row =>
                this.mapRolePermission(
                    row as RolePermissionRow,
                ),
        );
    }


    async assign(
        roleId: string,
        permissionId: string,
    ): Promise<void> {

        const normalizedRoleId =
            this.requireId(
                roleId,
                "Role id",
            );

        const normalizedPermissionId =
            this.requireId(
                permissionId,
                "Permission id",
            );

        const {
            error,
        } =
            await this
                .tableRef()
                .upsert(
                    {
                        organization_id:
                            this.organizationId,

                        role_id:
                            normalizedRoleId,

                        permission_id:
                            normalizedPermissionId,
                    },
                    {
                        onConflict:
                            "role_id,permission_id",
                    },
                );

        if (error) {
            throw error;
        }
    }


    async revoke(
        roleId: string,
        permissionId: string,
    ): Promise<void> {

        const normalizedRoleId =
            this.requireId(
                roleId,
                "Role id",
            );

        const normalizedPermissionId =
            this.requireId(
                permissionId,
                "Permission id",
            );

        const {
            error,
        } =
            await this
                .tableRef()
                .delete()
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "role_id",
                    normalizedRoleId,
                )
                .eq(
                    "permission_id",
                    normalizedPermissionId,
                );

        if (error) {
            throw error;
        }
    }


    async replace(
        roleId: string,
        permissionIds: string[],
    ): Promise<void> {

        const normalizedRoleId =
            this.requireId(
                roleId,
                "Role id",
            );

        if (!Array.isArray(permissionIds)) {
            throw new Error(
                "Permission ids must be an array.",
            );
        }

        const uniquePermissionIds =
            [
                ...new Set(
                    permissionIds
                        .map(
                            permissionId =>
                                permissionId?.trim(),
                        )
                        .filter(
                            (
                                permissionId,
                            ): permissionId is string =>
                                Boolean(permissionId),
                        ),
                ),
            ];

        const {
            error: deleteError,
        } =
            await this
                .tableRef()
                .delete()
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "role_id",
                    normalizedRoleId,
                );

        if (deleteError) {
            throw deleteError;
        }

        if (
            uniquePermissionIds.length === 0
        ) {
            return;
        }

        const rows =
            uniquePermissionIds.map(
                permissionId => ({
                    organization_id:
                        this.organizationId,

                    role_id:
                        normalizedRoleId,

                    permission_id:
                        permissionId,
                }),
            );

        const {
            error,
        } =
            await this
                .tableRef()
                .insert(
                    rows,
                );

        if (error) {
            throw error;
        }
    }


    private requireId(
        id: string,
        fieldName: string,
    ): string {

        const normalizedId =
            id?.trim();

        if (!normalizedId) {
            throw new Error(
                `${fieldName} is required.`,
            );
        }

        return normalizedId;
    }


    private mapRolePermission(
        row: RolePermissionRow,
    ): RolePermission {

        return {

            id:
                row.id,

            organizationId:
                row.organization_id,

            roleId:
                row.role_id,

            permissionId:
                row.permission_id,

            createdAt:
                row.created_at,

            updatedAt:
                row.updated_at,
        };
    }
}