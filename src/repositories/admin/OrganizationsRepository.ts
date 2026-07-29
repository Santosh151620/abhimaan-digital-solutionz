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

    async list(): Promise<Organization[]> {
        const {
            data,
            error,
        } = await this
            .tableRef()
            .select("*")
            .order(
                "name",
                {
                    ascending: true,
                },
            );

        if (error) {
            throw error;
        }

        return (data ?? []) as Organization[];
    }

    async active(): Promise<Organization[]> {
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
                    ascending: true,
                },
            );

        if (error) {
            throw error;
        }

        return (data ?? []) as Organization[];
    }

    async inactive(): Promise<Organization[]> {
        const {
            data,
            error,
        } = await this
            .tableRef()
            .select("*")
            .eq(
                "is_active",
                false,
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

        return (data ?? []) as Organization[];
    }

    async findBySlug(
        slug: string,
    ): Promise<Organization | null> {

        const {
            data,
            error,
        } = await this
            .tableRef()
            .select("*")
            .eq(
                "slug",
                slug,
            )
            .maybeSingle();

        if (error) {
            throw error;
        }

        return (data as Organization) ?? null;
    }
}
