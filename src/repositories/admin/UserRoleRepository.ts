import type { SupabaseClient } from "@supabase/supabase-js";

import { BaseRepository } from "@/lib/db/base-repository";

import type {
    UserRole,
} from "@/types/admin/UserRole";



export interface IUserRoleRepository {

    rolesForUser(
        userId: string,
    ): Promise<UserRole[]>;

    assignRole(
        userId: string,
        roleId: string,
    ): Promise<void>;

    removeRole(
        userId: string,
        roleId: string,
    ): Promise<void>;

    replaceRoles(
        userId: string,
        roleIds: string[],
    ): Promise<void>;

    setPrimaryRole(
        userId: string,
        roleId: string,
    ): Promise<void>;

}



export class UserRoleRepository
    extends BaseRepository<UserRole>
    implements IUserRoleRepository {

    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            "admin_user_roles",
        );

    }



    async rolesForUser(
        userId: string,
    ): Promise<UserRole[]> {

        const {
            data,
            error,
        } = await this
            .tableRef()
            .select("*")
            .eq(
                "user_id",
                userId,
            )
            .order(
                "is_primary",
                {
                    ascending: false,
                },
            );

        if (error) {

            throw error;

        }

        return (data ?? []) as UserRole[];

    }



    async assignRole(
        userId: string,
        roleId: string,
    ): Promise<void> {

        const {
            error,
        } = await this
            .tableRef()
            .upsert(
                {
                    user_id: userId,
                    role_id: roleId,
                    is_primary: false,
                },
                {
                    onConflict: "user_id,role_id",
                },
            );

        if (error) {

            throw error;

        }

    }



    async removeRole(
        userId: string,
        roleId: string,
    ): Promise<void> {

        const {
            error,
        } = await this
            .tableRef()
            .delete()
            .eq(
                "user_id",
                userId,
            )
            .eq(
                "role_id",
                roleId,
            );

        if (error) {

            throw error;

        }

    }



    async replaceRoles(
        userId: string,
        roleIds: string[],
    ): Promise<void> {

        const {
            error: deleteError,
        } = await this
            .tableRef()
            .delete()
            .eq(
                "user_id",
                userId,
            );

        if (deleteError) {

            throw deleteError;

        }

        if (roleIds.length === 0) {

            return;

        }

        const rows = roleIds.map(

            (
                roleId,
                index,
            ) => ({

                user_id: userId,

                role_id: roleId,

                is_primary: index === 0,

            }),

        );

        const {
            error,
        } = await this
            .tableRef()
            .insert(
                rows,
            );

        if (error) {

            throw error;

        }

    }



    async setPrimaryRole(
        userId: string,
        roleId: string,
    ): Promise<void> {

        const {
            error: clearError,
        } = await this
            .tableRef()
            .update({
                is_primary: false,
            })
            .eq(
                "user_id",
                userId,
            );

        if (clearError) {

            throw clearError;

        }

        const {
            error,
        } = await this
            .tableRef()
            .update({
                is_primary: true,
            })
            .eq(
                "user_id",
                userId,
            )
            .eq(
                "role_id",
                roleId,
            );

        if (error) {

            throw error;

        }

    }

}