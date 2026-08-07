/**
 * ============================================================================
 * Permissions Repository
 *
 * Admin RBAC Permission Registry
 *
 * Architecture:
 *
 * PermissionService
 *        ↓
 * PermissionsRepository
 *        ↓
 * BaseRepository
 *        ↓
 * permissions
 *
 * ============================================================================
 */


import type {
    SupabaseClient,
} from "@supabase/supabase-js";


import {
    BaseRepository,
} from "@/lib/db/base-repository";


import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";


import type {
    Permission,
} from "@/types/admin/Permission";





type PermissionRow = {

    id:string;

    organization_id:string | null;

    key:string;

    name:string;

    description:string | null;

    module:string;

    action:string;

    type:string;

    is_system:boolean | null;

    is_active:boolean | null;

    metadata:Record<string,unknown> | null;

    created_at:string;

    updated_at:string;

};





export interface IPermissionsRepository {


    list():
        Promise<Permission[]>;


    active():
        Promise<Permission[]>;


    findById(
        id:string,
    ):
        Promise<Permission | null>;


    findByKey(
        key:string,
    ):
        Promise<Permission | null>;


    search(
        keyword:string,
    ):
        Promise<Permission[]>;


    save(
        permission:Permission,
    ):
        Promise<void>;


    delete(
        id:string,
    ):
        Promise<void>;

}








export class PermissionsRepository

    extends BaseRepository<Permission>

    implements IPermissionsRepository {





    constructor(
        supabase:SupabaseClient,
    ){

        super(
            supabase,
            "permissions",
        );

    }






    static async create():

        Promise<PermissionsRepository> {


        const supabase =
            await createSupabaseServerClient();



        return new PermissionsRepository(
            supabase,
        );

    }









    async list():
        Promise<Permission[]> {


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
                .order(
                    "module",
                    {
                        ascending:true,
                    },
                );


        if(error)
            throw error;



        return (data ?? [])
            .map(
                row =>
                    this.mapPermission(
                        row as PermissionRow,
                    ),
            );


    }









    async active():
        Promise<Permission[]> {


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
                    "is_active",
                    true,
                )
                .order(
                    "module",
                    {
                        ascending:true,
                    },
                );



        if(error)
            throw error;



        return (data ?? [])
            .map(
                row =>
                    this.mapPermission(
                        row as PermissionRow,
                    ),
            );


    }









    async findById(
        id:string,
    ):
        Promise<Permission | null> {



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
                    "id",
                    id,
                )
                .maybeSingle();



        if(error)
            throw error;



        return data
            ?
                this.mapPermission(
                    data as PermissionRow,
                )
            :
                null;


    }









    async findByKey(
        key:string,
    ):
        Promise<Permission | null> {



        const normalizedKey =
            key
                .trim()
                .toLowerCase();



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
                    "key",
                    normalizedKey,
                )
                .maybeSingle();



        if(error)
            throw error;



        return data
            ?
                this.mapPermission(
                    data as PermissionRow,
                )
            :
                null;


    }









    async search(
        keyword:string,
    ):
        Promise<Permission[]> {



        const search =
            keyword.trim();



        if(!search){

            return this.list();

        }



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
                .or(
                    [
                        `name.ilike.%${search}%`,
                        `module.ilike.%${search}%`,
                        `action.ilike.%${search}%`,
                        `key.ilike.%${search}%`,
                    ].join(","),
                );



        if(error)
            throw error;



        return (data ?? [])
            .map(
                row =>
                    this.mapPermission(
                        row as PermissionRow,
                    ),
            );


    }









    async save(
        permission:Permission,
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
                            permission.id,


                        organization_id:
                            this.organizationId,


                        key:
                            permission.key
                                .trim()
                                .toLowerCase(),


                        name:
                            permission.name
                                .trim(),


                        description:
                            permission.description
                            ??
                            null,


                        module:
                            permission.module
                                .trim(),


                        action:
                            permission.action
                                .trim(),


                        type:
                            permission.type,


                        is_system:
                            permission.isSystem,


                        is_active:
                            permission.isActive,


                        metadata:
                            permission.metadata
                            ??
                            {},


                        created_at:
                            permission.createdAt
                            ??
                            now,


                        updated_at:
                            now,


                    },

                    {
                        onConflict:"id",
                    },

                );



        if(error)
            throw error;


    }









    async delete(
        id:string,
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
                    "id",
                    id,
                );



        if(error)
            throw error;


    }









    private mapPermission(
        row:PermissionRow,
    ):
        Permission {



        return {


            id:
                row.id,


            organizationId:
                row.organization_id
                ??
                "",


            key:
                row.key,


            name:
                row.name,


            description:
                row.description
                ??
                "",


            module:
                row.module,


            action:
                row.action,


            type:
                row.type as Permission["type"],


            isSystem:
                row.is_system
                ??
                false,


            isActive:
                row.is_active
                ??
                false,


            metadata:
                row.metadata
                ??
                {},


            createdAt:
                row.created_at,


            updatedAt:
                row.updated_at,


        };


    }


}