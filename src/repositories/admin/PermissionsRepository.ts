
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

    list(): Promise<Permission[]>;

    active(): Promise<Permission[]>;

    findById(
        id: string,
    ): Promise<Permission | null>;

    findByKey(
        key: string,
    ): Promise<Permission | null>;

    search(
        keyword: string,
    ): Promise<Permission[]>;

    save(
        permission: Permission,
    ): Promise<Permission>;

    delete(
        id: string,
    ): Promise<void>;

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


    static async create(): Promise<PermissionsRepository> {

        const supabase =
            await createSupabaseServerClient();

        return new PermissionsRepository(
            supabase,
        );
    }


    async list(): Promise<Permission[]> {

        const {
            data,
            error,
        } = await this
            .tableRef()
            .select("*")
            .eq(
                "organization_id",
                this.organizationId,
            )
            .order(
                "module",
                {
                    ascending: true,
                },
            )
            .order(
                "action",
                {
                    ascending: true,
                },
            )
            .order(
                "name",
                {
                    ascending: true,
                },
            );

        if (error) {
            throw error;
        }

        return (data ?? []).map(
            row =>
                this.mapPermission(
                    row as PermissionRow,
                ),
        );
    }


    async active(): Promise<Permission[]> {

        const {
            data,
            error,
        } = await this
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
                    ascending: true,
                },
            )
            .order(
                "action",
                {
                    ascending: true,
                },
            )
            .order(
                "name",
                {
                    ascending: true,
                },
            );

        if (error) {
            throw error;
        }

        return (data ?? []).map(
            row =>
                this.mapPermission(
                    row as PermissionRow,
                ),
        );
    }


    async findById(
        id: string,
    ): Promise<Permission | null> {

        const normalizedId =
            this.requireId(id);

        const {
            data,
            error,
        } = await this
            .tableRef()
            .select("*")
            .eq(
                "organization_id",
                this.organizationId,
            )
            .eq(
                "id",
                normalizedId,
            )
            .maybeSingle();

        if (error) {
            throw error;
        }

        return data
            ? this.mapPermission(
                data as PermissionRow,
            )
            : null;
    }


    async findByKey(
        key: string,
    ): Promise<Permission | null> {

        const normalizedKey =
            this.normalizeKey(key);

        const {
            data,
            error,
        } = await this
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

        if (error) {
            throw error;
        }

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
            keyword?.trim() ?? "";

        if (!search) {
            return this.list();
        }

        const escapedSearch =
            this.escapeIlikePattern(search);

        const {
            data,
            error,
        } = await this
            .tableRef()
            .select("*")
            .eq(
                "organization_id",
                this.organizationId,
            )
            .or(
                [
                    `name.ilike.%${escapedSearch}%`,
                    `module.ilike.%${escapedSearch}%`,
                    `action.ilike.%${escapedSearch}%`,
                    `key.ilike.%${escapedSearch}%`,
                ].join(","),
            )
            .order(
                "module",
                {
                    ascending: true,
                },
            )
            .order(
                "action",
                {
                    ascending: true,
                },
            )
            .order(
                "name",
                {
                    ascending: true,
                },
            );

        if (error) {
            throw error;
        }

        return (data ?? []).map(
            row =>
                this.mapPermission(
                    row as PermissionRow,
                ),
        );
    }


    async save(
        permission: Permission,
    ): Promise<Permission> {

        if (!permission) {
            throw new Error(
                "Permission is required.",
            );
        }

        const id =
            this.requireId(
                permission.id,
                "Permission id",
            );

        const key =
            this.normalizeKey(
                permission.key,
            );

        const name =
            permission.name?.trim();

        if (!name) {
            throw new Error(
                "Permission name is required.",
            );
        }

        const moduleName =
    permission.module?.trim();

if (!moduleName) {
    throw new Error(
        "Permission module is required.",
    );
}

        const action =
            permission.action?.trim();

        if (!action) {
            throw new Error(
                "Permission action is required.",
            );
        }

        const now =
            new Date().toISOString();

        const {
            data,
            error,
        } = await this
            .tableRef()
            .upsert(
                {
                    id,

                    organization_id:
                        this.organizationId,

                    key,

                    name,

                    description:
                        permission.description?.trim()
                        || null,

                    module,

                    action,

                    type:
                        permission.type,

                    is_system:
                        permission.isSystem,

                    is_active:
                        permission.isActive,

                    metadata:
                        permission.metadata ?? {},

                    created_at:
                        permission.createdAt
                        ?? now,

                    updated_at:
                        now,
                },
                {
                    onConflict: "id",
                },
            )
            .select("*")
            .single();

        if (error) {
            throw error;
        }

        if (!data) {
            throw new Error(
                "Permission save returned no data.",
            );
        }

        return this.mapPermission(
            data as PermissionRow,
        );
    }


    async delete(
        id: string,
    ): Promise<void> {

        const normalizedId =
            this.requireId(id);

        const {
            error,
        } = await this
            .tableRef()
            .delete()
            .eq(
                "organization_id",
                this.organizationId,
            )
            .eq(
                "id",
                normalizedId,
            );

        if (error) {
            throw error;
        }
    }


    private requireId(
        id: string,
        fieldName = "Permission id",
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


    private normalizeKey(
        key: string,
    ): string {

        const normalizedKey =
            key?.trim().toLowerCase();

        if (!normalizedKey) {
            throw new Error(
                "Permission key is required.",
            );
        }

        return normalizedKey;
    }


    private escapeIlikePattern(
        value: string,
    ): string {

        return value
            .replace(/\\/g, "\\\\")
            .replace(/%/g, "\\%")
            .replace(/_/g, "\\_")
            .replace(/,/g, "\\,");
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