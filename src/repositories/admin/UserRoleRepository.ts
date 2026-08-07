/**
 * ============================================================================
 * ADS User Role Repository
 * Production RBAC Assignment Repository
 * ============================================================================
 */

import type {
    SupabaseClient,
} from "@supabase/supabase-js";


import {
    BaseRepository,
} from "@/lib/db/base-repository";


import type {
    UserRole,
} from "@/types/admin/UserRole";





type UserRoleRow = {

    id:string;

    organization_id:string;

    user_id:string;

    role_id:string;

    is_primary:boolean | null;

    is_active:boolean | null;

    assigned_by:string | null;

    assigned_at:string | null;

    created_at:string;

    updated_at:string;

};






export interface IUserRoleRepository {


    rolesForUser(
        userId:string,
    ):
        Promise<UserRole[]>;



    assignRole(
        userId:string,
        roleId:string,
    ):
        Promise<void>;



    removeRole(
        userId:string,
        roleId:string,
    ):
        Promise<void>;



    replaceRoles(
        userId:string,
        roleIds:string[],
    ):
        Promise<void>;



    setPrimaryRole(
        userId:string,
        roleId:string,
    ):
        Promise<void>;

}




export class UserRoleRepository

    extends BaseRepository<UserRole>

    implements IUserRoleRepository {


    constructor(
        supabase:SupabaseClient,
    ){

        super(
            supabase,
            "user_roles",
        );

    }







    async rolesForUser(
        userId:string,
    ):
        Promise<UserRole[]> {


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
                    "user_id",
                    userId,
                )

                .eq(
                    "is_active",
                    true,
                );



        if(error)
            throw error;



        return (data ?? [])
            .map(
                row =>
                    this.mapRole(
                        row as UserRoleRow,
                    ),
            );

    }








    async assignRole(
        userId:string,
        roleId:string,
    ):
        Promise<void> {


        const now =
            new Date()
                .toISOString();



        const {
            error,
        } =
            await this

                .tableRef()

                .upsert(
                    {

                        id:
                            crypto.randomUUID(),

                        organization_id:
                            this.organizationId,

                        user_id:
                            userId,

                        role_id:
                            roleId,

                        is_active:
                            true,

                        is_primary:
                            false,

                        assigned_at:
                            now,

                        updated_at:
                            now,

                    },
                );



        if(error)
            throw error;

    }








    async removeRole(
        userId:string,
        roleId:string,
    ):
        Promise<void> {


        const {
            error,
        } =
            await this

                .tableRef()

                .update(
                    {

                        is_active:false,

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
                    "user_id",
                    userId,
                )

                .eq(
                    "role_id",
                    roleId,
                );



        if(error)
            throw error;

    }








    async replaceRoles(
        userId:string,
        roleIds:string[],
    ):
        Promise<void> {


        const now =
            new Date()
                .toISOString();



        const {
            error:updateError,
        } =
            await this

                .tableRef()

                .update(
                    {

                        is_active:false,

                        updated_at:now,

                    },
                )

                .eq(
                    "organization_id",
                    this.organizationId,
                )

                .eq(
                    "user_id",
                    userId,
                );



        if(updateError)
            throw updateError;



        const uniqueRoleIds =
            [
                ...new Set(
                    roleIds,
                ),
            ];



        if(
            uniqueRoleIds.length === 0
        )
            return;



        const rows =
            uniqueRoleIds.map(
                roleId => ({

                    id:
                        crypto.randomUUID(),

                    organization_id:
                        this.organizationId,

                    user_id:
                        userId,

                    role_id:
                        roleId,

                    is_active:
                        true,

                    is_primary:
                        false,

                    assigned_at:
                        now,

                    updated_at:
                        now,

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








    async setPrimaryRole(
        userId:string,
        roleId:string,
    ):
        Promise<void> {


        const now =
            new Date()
                .toISOString();



        const {
            error:disableError,
        } =
            await this

                .tableRef()

                .update(
                    {

                        is_primary:false,

                        updated_at:now,

                    },
                )

                .eq(
                    "organization_id",
                    this.organizationId,
                )

                .eq(
                    "user_id",
                    userId,
                );



        if(disableError)
            throw disableError;




        const {
            error,
        } =
            await this

                .tableRef()

                .update(
                    {

                        is_primary:true,

                        updated_at:now,

                    },
                )

                .eq(
                    "organization_id",
                    this.organizationId,
                )

                .eq(
                    "user_id",
                    userId,
                )

                .eq(
                    "role_id",
                    roleId,
                );



        if(error)
            throw error;

    }








    private mapRole(
        row:UserRoleRow,
    ):
        UserRole {


        return {

            id:
                row.id,

            organizationId:
                row.organization_id,

            userId:
                row.user_id,

            roleId:
                row.role_id,

            isPrimary:
                row.is_primary ?? false,

            isActive:
                row.is_active ?? false,

            assignedBy:
                row.assigned_by ?? undefined,

            assignedAt:
                row.assigned_at
                ??
                row.created_at,

            createdAt:
                row.created_at,

            updatedAt:
                row.updated_at,

        };

    }


}