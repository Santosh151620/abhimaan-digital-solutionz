import type { SupabaseClient } from "@supabase/supabase-js";

import { BaseRepository } from "@/lib/db/base-repository";

import type {
    Organization,
} from "@/types/admin/Organization";

export class OrganizationsRepository
    extends BaseRepository<Organization> {

    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            "organizations",
        );

    }

    async active(): Promise<Organization[]> {

        const {
            data,
            error,
        } = await this
            .tableRef()
            .select("*")
            .eq(
                "status",
                "Active",
            );

        if (error)
            throw error;

        return (
            data ?? []
        ) as Organization[];

    }

    async archived(): Promise<Organization[]> {

        const {
            data,
            error,
        } = await this
            .tableRef()
            .select("*")
            .eq(
                "status",
                "Archived",
            );

        if (error)
            throw error;

        return (
            data ?? []
        ) as Organization[];

    }

}
