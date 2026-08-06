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

    id: string;

    organization_id: string | null;

    role_name: string;

    role_key: string;

    description: string | null;

    is_system_role: boolean | null;

    status: string | null;

    created_at: string;

    updated_at: string;

};




export interface IRolesRepository {

    list(): Promise<Role[]>;

    active(): Promise<Role[]>;

    systemRoles(): Promise<Role[]>;

    customRoles(): Promise<Role[]>;

    search(
        keyword: string,
    ): Promise<Role[]>;

    findById(
        id: string,
    ): Promise<Role | null>;

    findByCode(
        code: string,
    ): Promise<Role | null>;

    existsByCode(
        code: string,
    ): Promise<boolean>;

    existsByName(
        name: string,
    ): Promise<boolean>;

    save(
        role: Role,
    ): Promise<void>;

    delete(
        id: string,
    ): Promise<void>;

}





export class RolesRepository
extends BaseRepository<Role>
implements IRolesRepository {


    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            "admin_roles",
        );

    }




    async list(): Promise<Role[]> {


        const {
            data,
            error,
        } =
        await this
            .tableRef()
            .select("*")
            .order(
                "role_name",
                {
                    ascending: true,
                },
            );


        if(error)
            throw error;


        return (data ?? [])
            .map(
                item =>
                    this.mapRole(
                        item as RoleRow,
                    ),
            );

    }




    async active(): Promise<Role[]> {


        const {
            data,
            error,
        } =
        await this
            .tableRef()
            .select("*")
            .eq(
                "status",
                "active",
            );


        if(error)
            throw error;


        return (data ?? [])
            .map(
                item =>
                    this.mapRole(
                        item as RoleRow,
                    ),
            );

    }




    async systemRoles(): Promise<Role[]> {


        const {
            data,
            error,
        } =
        await this
            .tableRef()
            .select("*")
            .eq(
                "is_system_role",
                true,
            );


        if(error)
            throw error;


        return (data ?? [])
            .map(
                item =>
                    this.mapRole(
                        item as RoleRow,
                    ),
            );

    }




    async customRoles(): Promise<Role[]> {


        const {
            data,
            error,
        } =
        await this
            .tableRef()
            .select("*")
            .eq(
                "is_system_role",
                false,
            );


        if(error)
            throw error;


        return (data ?? [])
            .map(
                item =>
                    this.mapRole(
                        item as RoleRow,
                    ),
            );

    }





    async search(
        keyword:string,
    ):Promise<Role[]> {


        const {
            data,
            error,
        } =
        await this
            .tableRef()
            .select("*")
            .or(
                `role_name.ilike.%${keyword}%,role_key.ilike.%${keyword}%`,
            );


        if(error)
            throw error;


        return (data ?? [])
            .map(
                item =>
                    this.mapRole(
                        item as RoleRow,
                    ),
            );

    }





    async findById(
        id:string,
    ):Promise<Role|null>{


        const {
            data,
            error,
        } =
        await this
            .tableRef()
            .select("*")
            .eq(
                "id",
                id,
            )
            .maybeSingle();


        if(error)
            throw error;


        return data
            ? this.mapRole(
                data as RoleRow,
            )
            : null;

    }





    async findByCode(
        code:string,
    ):Promise<Role|null>{


        const {
            data,
            error,
        } =
        await this
            .tableRef()
            .select("*")
            .eq(
                "role_key",
                code,
            )
            .maybeSingle();


        if(error)
            throw error;


        return data
            ? this.mapRole(
                data as RoleRow,
            )
            : null;

    }





    async existsByCode(
        code:string,
    ):Promise<boolean>{


        const {
            count,
            error,
        } =
        await this
            .tableRef()
            .select(
                "id",
                {
                    count:"exact",
                    head:true,
                },
            )
            .eq(
                "role_key",
                code,
            );


        if(error)
            throw error;


        return (count ?? 0) > 0;

    }





    async existsByName(
        name:string,
    ):Promise<boolean>{


        const {
            count,
            error,
        } =
        await this
            .tableRef()
            .select(
                "id",
                {
                    count:"exact",
                    head:true,
                },
            )
            .ilike(
                "role_name",
                name,
            );


        if(error)
            throw error;


        return (count ?? 0) > 0;

    }





    async save(
        role:Role,
    ):Promise<void>{


        const {
            error,
        } =
        await this
            .tableRef()
            .upsert({

                id:
                    role.id,

                organization_id:
                    role.organizationId,

                role_name:
                    role.name,

                role_key:
                    role.code,

                description:
                    role.description ?? null,

                is_system_role:
                    role.isSystem,

                status:
                    role.isActive
                    ? "active"
                    : "inactive",

            });


        if(error)
            throw error;

    }





    async delete(
        id:string,
    ):Promise<void>{


        await super.delete(
            id,
        );

    }





    private mapRole(
        item:RoleRow,
    ):Role {


        return {

            id:
                item.id,

            organizationId:
                item.organization_id ?? undefined,

            name:
                item.role_name,

            code:
                item.role_key,

            description:
                item.description ?? undefined,

            type:
                item.is_system_role
                ? "System"
                : "Organization",

            level:
                "Organization",

            status:
                item.status === "active"
                ? "Active"
                : "Inactive",

            permissionIds:
                [],

            isSystem:
                item.is_system_role ?? false,

            isDefault:
                false,

            isActive:
                item.status === "active",

            createdAt:
                item.created_at,

            updatedAt:
                item.updated_at,

        };

    }


}