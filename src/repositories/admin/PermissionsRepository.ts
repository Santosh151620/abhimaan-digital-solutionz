import type {
    SupabaseClient,
} from "@supabase/supabase-js";


import {
    BaseRepository,
} from "@/lib/db/base-repository";


import type {
    Permission,
} from "@/types/admin/Permission";







type PermissionRow = {



    id: string;



    organization_id: string | null;



    key: string;



    name: string;



    description: string | null;



    module: string;



    action: string;



    type: string;



    is_system: boolean | null;



    is_active: boolean | null;



    metadata: Record<string, unknown> | null;



    created_at: string;



    updated_at: string;



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

        supabase: SupabaseClient,

    ) {



        super(

            supabase,

            "permissions",

        );



    }









    async list():

        Promise<Permission[]> {



        const {

            data,

            error,

        } = await this

            .tableRef()

            .select("*")

            .order(

                "module",

                {

                    ascending: true,

                },

            );







        if (error)

            throw error;







        return (data ?? [])

            .map(

                row =>

                    this.mapPermission(

                        row as unknown as PermissionRow,

                    ),

            );



    }









    async active():

        Promise<Permission[]> {



        const {

            data,

            error,

        } = await this

            .tableRef()

            .select("*")

            .eq(

                "is_active",

                true,

            );







        if (error)

            throw error;







        return (data ?? [])

            .map(

                row =>

                    this.mapPermission(

                        row as unknown as PermissionRow,

                    ),

            );



    }









    async findById(

        id: string,

    ):

        Promise<Permission | null> {



        const {

            data,

            error,

        } = await this

            .tableRef()

            .select("*")

            .eq(

                "id",

                id,

            )

            .maybeSingle();







        if (error)

            throw error;







        return data

            ? this.mapPermission(

                data as unknown as PermissionRow,

            )

            : null;



    }

async findByKey(
    key:string,
):
    Promise<Permission | null> {

    const {
        data,
        error,
    } = await this
        .tableRef()
        .select("*")
        .eq(
            "key",
            key.trim().toLowerCase(),
        )
        .maybeSingle();

    if(error)
        throw error;

    return data
        ? this.mapPermission(
            data as PermissionRow,
        )
        : null;
}

    async search(
        keyword: string,
    ): Promise<Permission[]> {

        const search =
            keyword.trim();

        const {
            data,
            error,
        } = await this
            .tableRef()
            .select("*")
            .or(
                [
                    `name.ilike.%${search}%`,
                    `module.ilike.%${search}%`,
                    `action.ilike.%${search}%`,
                    `key.ilike.%${search}%`,
                ].join(","),
            );

        if (error) {
            throw error;
        }

        return (data ?? []).map(
            row =>
                this.mapPermission(
                    row as unknown as PermissionRow,
                ),
        );
    }

    async save(

        permission: Permission,

    ):

        Promise<void> {



        const {

            error,

        } = await this

            .tableRef()

            .upsert({

                id:

                    permission.id,

                organization_id:

                    permission.organizationId ?? null,

                key:

                    permission.key
                        .trim()
                        .toLowerCase(),

                name:

                    permission.name.trim(),

                description:

                    permission.description ?? null,

                module:

                    permission.module.trim(),

                action:

                    permission.action.trim(),

                type:

                    permission.type,

                is_system:

                    permission.isSystem,

                is_active:

                    permission.isActive,

                metadata:

                    permission.metadata ?? {},

                created_at:

                    permission.createdAt,

                updated_at:

                    permission.updatedAt,

            });

        if (error)

            throw error;



    }









    async delete(

        id: string,

    ):

        Promise<void> {



        await super.delete(

            id,

        );



    }


    private mapPermission(
        row: PermissionRow,

    ): Permission {
        return {
            id:
                row.id,
            organizationId:
                row.organization_id ?? "",
            key:
                row.key,
            name:
                row.name,
            description:
                row.description ?? "",
            module:
                row.module,
            action:
                row.action,
            type:
                row.type as Permission["type"],
            isSystem:
                row.is_system ?? false,
            isActive:
                row.is_active ?? false,
            metadata:
                row.metadata ?? {},
            createdAt:
                row.created_at,
            updatedAt:
                row.updated_at,
        };
    }
}