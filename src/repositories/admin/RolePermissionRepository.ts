import type {
    SupabaseClient,
} from "@supabase/supabase-js";

import {
    BaseRepository,
} from "@/lib/db/base-repository";

import type {
    RolePermission,
} from "@/types/admin/RolePermission";



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


        const {
            data,
            error,
        } =
            await this
                .tableRef()
                .select("*")
                .eq(
                    "role_id",
                    roleId,
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



        return (
            data ?? []
        ).map(
            (item) => ({

                id: item.id,

                roleId:
                    item.role_id,

                permissionId:
                    item.permission_id,

                organizationId:
                    item.organization_id,

                createdAt:
                    item.created_at,

                updatedAt:
                    item.updated_at,

            })
        ) as RolePermission[];

    }



    async assign(
        roleId: string,
        permissionId: string,
    ): Promise<void> {


        const {
            error,
        } =
            await this
                .tableRef()
                .upsert(
                    {
                        role_id: roleId,

                        permission_id: permissionId,
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


        const {
            error,
        } =
            await this
                .tableRef()
                .delete()
                .eq(
                    "role_id",
                    roleId,
                )
                .eq(
                    "permission_id",
                    permissionId,
                );


        if (error) {

            throw error;

        }

    }



    async replace(
        roleId: string,
        permissionIds: string[],
    ): Promise<void> {


        const {
            error: deleteError,
        } =
            await this
                .tableRef()
                .delete()
                .eq(
                    "role_id",
                    roleId,
                );


        if (deleteError) {

            throw deleteError;

        }



        if (
            permissionIds.length === 0
        ) {

            return;

        }



        const rows =
            permissionIds.map(
                (
                    permissionId,
                ) => ({

                    role_id:
                        roleId,

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

}