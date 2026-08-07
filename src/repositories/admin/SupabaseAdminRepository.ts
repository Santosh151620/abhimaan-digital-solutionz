/**
 * ============================================================================
 * ADS Admin Supabase Repository
 * Production Dashboard Data Provider
 * ============================================================================
 *
 * Responsibilities:
 * - Admin dashboard metrics
 * - Tenant scoped queries
 * - Uses existing repository schema conventions
 * - No hardcoded production values
 *
 * ============================================================================
 */


import type {
    SupabaseClient,
} from "@supabase/supabase-js";


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





    private get organizationId(): string {

        return TenantContextManager
            .require()
            .organizationId;

    }







    async dashboard():

        Promise<AdminDashboard> {


        const organizationId =
            this.organizationId;



        const [

            organizations,

            users,

            roles,

            permissions,

            audits,

            modules,

        ] = await Promise.all([



            this.supabase

                .from("organizations")

                .select("*", {
                    head:true,
                    count:"exact",
                }),




            this.supabase

                .from("profiles")

                .select("*", {
                    head:true,
                    count:"exact",
                })

                .eq(
                    "organization_id",
                    organizationId,
                ),




            this.supabase

                .from("roles")

                .select("*", {
                    head:true,
                    count:"exact",
                })

                .eq(
                    "organization_id",
                    organizationId,
                ),




            this.supabase

                .from("permissions")

                .select("*", {
                    head:true,
                    count:"exact",
                })

                .eq(
                    "organization_id",
                    organizationId,
                ),




            this.supabase

                .from("audit_logs")

                .select("*", {
                    head:true,
                    count:"exact",
                })

                .eq(
                    "organization_id",
                    organizationId,
                ),




            this.supabase

                .from("module_registry")

                .select("*", {
                    head:true,
                    count:"exact",
                }),



        ]);






        return {


            generatedAt:

                new Date()
                    .toISOString(),





            summary: {


                organizations:

                    organizations.count
                    ??
                    0,



                users:

                    users.count
                    ??
                    0,



                activeUsers:

                    users.count
                    ??
                    0,



                modules:

                    modules.count
                    ??
                    0,



                enabledModules:

                    modules.count
                    ??
                    0,



                roles:

                    roles.count
                    ??
                    0,



                permissions:

                    permissions.count
                    ??
                    0,



                audits:

                    audits.count
                    ??
                    0,



            },

        };


    }


}