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
        role:Role,
    ):
        Promise<void>;
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
    ) {
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
        } = await this
            .tableRef()
            .select("*")
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
        } = await this
            .tableRef()
            .select("*")
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
        } = await this
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
    ):
        Promise<Role | null> {
        const {
            data,
            error,
        } = await this
            .tableRef()
            .select("*")
            .eq(
                "code",
                code
                    .trim()
                    .toLowerCase(),
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









    async save(

        role:Role,

    ):

        Promise<void> {



        const {

            error,

        } = await this

            .tableRef()
.upsert(
    {
        id:
            role.id,

        organization_id:
            role.organizationId ?? null,

        name:
            role.name.trim(),

        code:
            role.code
                .trim()
                .toLowerCase(),

        description:
            role.description ?? null,

        type:
            role.type,

        level:
            role.level,

        status:
            role.status,

        permission_ids:
            role.permissionIds ?? [],

        is_system:
            role.isSystem,

        is_default:
            role.isDefault,

        is_active:
            role.isActive,

        metadata:
            role.metadata ?? {},

        created_at:
            role.createdAt,

        updated_at:
            role.updatedAt,
    },
    {
        onConflict: "id",
    },
);
        if(error)
            throw error;
    }

    async delete(
        id:string,
    ):
        Promise<void> {
        await super.delete(
            id,
        );
    }

    private mapRole(
        row:RoleRow,
    ):Role {
        return {
            id:
                row.id,
            organizationId:
                row.organization_id
                ?? undefined,
            name:
                row.name,
            code:
                row.code,
            description:
                row.description
                ?? undefined,
            type:
                row.type as Role["type"],
            level:
                row.level as Role["level"],
            status:
                row.status as Role["status"],
            permissionIds:
                row.permission_ids ?? [],
            isSystem:
                row.is_system ?? false,
            isDefault:
                row.is_default ?? false,
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