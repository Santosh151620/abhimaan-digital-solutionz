import type { SupabaseClient } from "@supabase/supabase-js";

import type {
    AdminDashboard,
} from "@/types/admin/Admin";

import type {
    IAdminRepository,
} from "./AdminRepository";

import {
    TenantContextManager,
} from "@/lib/tenant/tenantContext";

export class SupabaseAdminRepository
    implements IAdminRepository {

    constructor(
        private readonly supabase: SupabaseClient,
    ) {}

    async dashboard(): Promise<AdminDashboard> {

        const organizationId =
            TenantContextManager
                .require()
                .organizationId;

        const [
            users,
            roles,
            permissions,
            audits,
            modules,
        ] = await Promise.all([

            this.supabase
                .from("profiles")
                .select("*", {
                    head: true,
                    count: "exact",
                })
                .eq(
                    "organization_id",
                    organizationId,
                ),

            this.supabase
                .schema("admin")
                .from("roles")
                .select("*", {
                    head: true,
                    count: "exact",
                }),

            this.supabase
                .schema("admin")
                .from("permissions")
                .select("*", {
                    head: true,
                    count: "exact",
                }),

            this.supabase
                .schema("audit")
                .from("audit_events")
                .select("*", {
                    head: true,
                    count: "exact",
                })
                .eq(
                    "organization_id",
                    organizationId,
                ),

            this.supabase
                .from("entity_types")
                .select("*", {
                    head: true,
                    count: "exact",
                }),

        ]);

        return {

            generatedAt:
                new Date().toISOString(),

            summary: {

                organizations: 1,

                users:
                    users.count ?? 0,

                activeUsers:
                    users.count ?? 0,

                modules:
                    modules.count ?? 0,

                enabledModules:
                    modules.count ?? 0,

                roles:
                    roles.count ?? 0,

                permissions:
                    permissions.count ?? 0,

                audits:
                    audits.count ?? 0,

            },

        };

    }

}