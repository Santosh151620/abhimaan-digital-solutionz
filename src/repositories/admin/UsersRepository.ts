import type { SupabaseClient } from "@supabase/supabase-js";

import { BaseRepository } from "@/lib/db/base-repository";

import type {
    AdminUser,
} from "@/types/admin/User";

export class UsersRepository
    extends BaseRepository<AdminUser> {

    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            "profiles",
        );

    }

    async active(): Promise<AdminUser[]> {

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
                "status",
                "Active",
            );

        if (error)
            throw error;

        return (
            data ?? []
        ) as AdminUser[];

    }

    async pending(): Promise<AdminUser[]> {

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
                "status",
                "Pending",
            );

        if (error)
            throw error;

        return (
            data ?? []
        ) as AdminUser[];

    }

}
