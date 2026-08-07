/**
 * ============================================================================
 * ADS Role Permission Repository
 * Production RBAC Repository
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

    id:string;

    organization_id:string;

    role_id:string;

    permission_id:string;

    created_at:string;

    updated_at:string;

};





export interface IRolePermissionRepository {


    listByRole(
        roleId:string,
    ):Promise<RolePermission[]>;



    assign(
        roleId:string,
        permissionId:string,
    ):Promise<void>;



    revoke(
        roleId:string,
        permissionId:string,
    ):Promise<void>;



    replace(
        roleId:string,
        permissionIds:string[],
    ):Promise<void>;

}




export class RolePermissionRepository

    extends BaseRepository<RolePermission>

    implements IRolePermissionRepository {



    constructor(
        supabase:SupabaseClient,
    ){

        super(
            supabase,
            "admin_role_permissions",
        );

    }







    async listByRole(
        roleId:string,
    ):
        Promise<RolePermission[]> {


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
                    roleId,
                )

                .order(
                    "created_at",
                    {
                        ascending:true,
                    },
                );



        if(error)
            throw error;



        return (data ?? [])
            .map(
                row =>
                    this.mapRolePermission(
                        row as RolePermissionRow,
                    ),
            );

    }








    async assign(
        roleId:string,
        permissionId:string,
    ):
        Promise<void> {


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
                            roleId,

                        permission_id:
                            permissionId,

                    },

                    {
                        onConflict:
                            "role_id,permission_id",
                    },
                );



        if(error)
            throw error;

    }








    async revoke(
        roleId:string,
        permissionId:string,
    ):
        Promise<void> {



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
                    roleId,
                )

                .eq(
                    "permission_id",
                    permissionId,
                );



        if(error)
            throw error;

    }








    async replace(
        roleId:string,
        permissionIds:string[],
    ):
        Promise<void> {


        const {
            error:deleteError,
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
                    roleId);



        if(deleteError)
            throw deleteError;




        const uniquePermissionIds =
            [
                ...new Set(
                    permissionIds,
                ),
            ];



        if(
            uniquePermissionIds.length === 0
        ){

            return;

        }




        const rows =
            uniquePermissionIds.map(
                permissionId => ({

                    organization_id:
                        this.organizationId,

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



        if(error)
            throw error;

    }







    private mapRolePermission(
        row:RolePermissionRow,
    ):
        RolePermission {


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