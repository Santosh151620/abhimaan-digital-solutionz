import type { SupabaseClient } from "@supabase/supabase-js";

import { BaseRepository } from "@/lib/db/base-repository";

import type { AdminDashboard } from "@/types/admin/Admin";

export class AdminRepository extends BaseRepository<AdminDashboard> {

    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            "organizations",
        );

    }

    async dashboard(): Promise<AdminDashboard> {

        const [
            organizations,
            users,
            modules,
        ] = await Promise.all([

            this.supabase
                .from("organizations")
                .select("*", {
                    count: "exact",
                    head: true,
                }),

            this.supabase
                .from("profiles")
                .select("*", {
                    count: "exact",
                    head: true,
                })
                .eq(
                    "organization_id",
                    this.organizationId,
                ),

            this.supabase
                .from("entity_types")
                .select("*", {
                    count: "exact",
                    head: true,
                }),

        ]);

        return {

            generatedAt: new Date().toISOString(),

            summary: {

                organizations:
                    organizations.count ?? 0,

                users:
                    users.count ?? 0,

                activeUsers:
                    users.count ?? 0,

                modules:
                    modules.count ?? 0,

                enabledModules:
                    modules.count ?? 0,

                roles: 0,

                permissions: 0,

                audits: 0,

            },

        };

    }

}
