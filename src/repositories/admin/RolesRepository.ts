/**
 * ============================================================================
 * Roles Repository
 *
 * Admin RBAC Role Registry
 *
 * Architecture:
 *
 * RoleService
 *        ↓
 * RolesRepository
 *        ↓
 * BaseRepository
 *        ↓
 * roles
 *
 * ============================================================================
 */


import type {
    SupabaseClient,
} from "@supabase/supabase-js";


import {
    BaseRepository,
} from "@/lib/db/base-repository";


import type {
    Role,
} from "@/types/admin/Role";




type RoleRow = {

    id:string;

    organization_id:string | null;

    name:string;

    code:string;

    description:string | null;

    type:string;

    level:string;

    status:string;

    permission_ids:string[] | null;

    is_system:boolean | null;

    is_default:boolean | null;

    is_active:boolean | null;

    metadata:Record<string,unknown> | null;

    created_at:string;

    updated_at:string;

};





export interface IRolesRepository {


    list():
        Promise<Role[]>;



    active():
        Promise<Role[]>;



    findById(
        id:string,
    ):
        Promise<Role | null>;



    findByCode(
        code:string,
    ):
        Promise<Role | null>;



    save(
        role:Partial<Role>,
    ):
        Promise<Role>;



    delete(
        id:string,
    ):
        Promise<void>;

}







export class RolesRepository

    extends BaseRepository<Role>

    implements IRolesRepository {





    constructor(
        supabase:SupabaseClient,
    ){

        super(
            supabase,
            "roles",
        );

    }









    async list():

        Promise<Role[]> {



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
                    "name",
                    {
                        ascending:true,
                    },
                );



        if(error)
            throw error;



        return (data ?? [])
            .map(
                row =>
                    this.mapRole(
                        row as RoleRow,
                    ),
            );


    }









    async active():

        Promise<Role[]> {



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
                    "name",
                    {
                        ascending:true,
                    },
                );



        if(error)
            throw error;



        return (data ?? [])
            .map(
                row =>
                    this.mapRole(
                        row as RoleRow,
                    ),
            );


    }









    async findById(
        id:string,
    ):
        Promise<Role | null> {



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
                this.mapRole(
                    data as RoleRow,
                )
            :
                null;


    }









    async findByCode(
        code:string,
    ):
        Promise<Role | null> {



        const normalizedCode =
            code
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
                    "code",
                    normalizedCode,
                )
                .maybeSingle();



        if(error)
            throw error;



        return data
            ?
                this.mapRole(
                    data as RoleRow,
                )
            :
                null;


    }









    async save(
        role:Partial<Role>,
    ):
        Promise<Role> {



        if(!role.name?.trim()) {

            throw new Error(
                "Role name is required.",
            );

        }



        if(!role.code?.trim()) {

            throw new Error(
                "Role code is required.",
            );

        }





        const now =
            new Date()
                .toISOString();





        const {
            data,
            error,

        } =
            await this
                .tableRef()
                .upsert(

                    {


                        id:
                            role.id
                            ??
                            crypto.randomUUID(),



                        organization_id:
                            this.organizationId,



                        name:
                            role.name
                                .trim(),



                        code:
                            role.code
                                .trim()
                                .toLowerCase(),



                        description:
                            role.description
                            ??
                            null,



                        type:
                            this.resolveType(
                                role.type,
                            ),



                        level:
                            this.resolveLevel(
                                role.level ?? null,
                            ),



                        status:
                            this.resolveStatus(
                                role.status,
                            ),



                        permission_ids:
                            Array.from(
                                new Set(
                                    role.permissionIds
                                    ??
                                    [],
                                ),
                            ),



                        is_system:
                            role.isSystem
                            ??
                            false,



                        is_default:
                            role.isDefault
                            ??
                            false,



                        is_active:
                            role.isActive
                            ??
                            true,



                        metadata:
                            role.metadata
                            ??
                            {},



                        created_at:
                            role.createdAt
                            ??
                            now,



                        updated_at:
                            now,


                    },

                    {
                        onConflict:"id",
                    },

                )
                .select()
                .single();





        if(error)
            throw error;





        return this.mapRole(
            data as RoleRow,
        );


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









    private resolveType(
        value:Role["type"] | undefined,
    ):
        Role["type"] {



        return value
            ??
            "Custom";


    }

private resolveLevel(
    value: string | null,
):
    Role["level"] {


    switch (
        value?.toUpperCase()
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
        value:Role["status"] | undefined,
    ):
        Role["status"] {



        return value
            ??
            "Active";


    }









    private mapRole(
        row:RoleRow,
    ):
        Role {



        return {


            id:
                row.id,



            organizationId:
                row.organization_id
                ??
                "",



            name:
                row.name,



            code:
                row.code,



            description:
                row.description
                ??
                undefined,



            type:
                this.resolveType(
                    row.type as Role["type"],
                ),



            level:
                this.resolveLevel(
                    row.level as Role["level"],
                ),



            status:
                this.resolveStatus(
                    row.status as Role["status"],
                ),



            permissionIds:
                row.permission_ids
                ??
                [],



            isSystem:
                row.is_system
                ??
                false,



            isDefault:
                row.is_default
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