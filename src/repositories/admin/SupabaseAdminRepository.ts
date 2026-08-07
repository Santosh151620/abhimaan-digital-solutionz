/**
 * ============================================================================
 * ADS Admin Supabase Repository
 *
 * Production Admin Dashboard Data Provider
 *
 * Responsibilities:
 * - Tenant-scoped dashboard metrics
 * - Explicit Supabase error handling
 * - No caller-controlled organization scope
 * - Accurate total / active user metrics
 * - Stable AdminDashboard mapping
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


type CountResult = {
    count: number | null;
    error: unknown;
};


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


    async dashboard(): Promise<AdminDashboard> {

        const organizationId =
            this.organizationId;


        const [
            organizationResult,
            usersResult,
            activeUsersResult,
            rolesResult,
            permissionsResult,
            auditsResult,
            modulesResult,
            enabledModulesResult,
        ] = await Promise.all([
            this.count(
                this.supabase
                    .from("organizations")
                    .select(
                        "id",
                        {
                            head: true,
                            count: "exact",
                        },
                    )
                    .eq(
                        "id",
                        organizationId,
                    ),
            ),

            this.count(
                this.supabase
                    .from("profiles")
                    .select(
                        "id",
                        {
                            head: true,
                            count: "exact",
                        },
                    )
                    .eq(
                        "organization_id",
                        organizationId,
                    ),
            ),

            this.count(
                this.supabase
                    .from("profiles")
                    .select(
                        "id",
                        {
                            head: true,
                            count: "exact",
                        },
                    )
                    .eq(
                        "organization_id",
                        organizationId,
                    )
                    .eq(
                        "is_active",
                        true,
                    ),
            ),

            this.count(
                this.supabase
                    .from("roles")
                    .select(
                        "id",
                        {
                            head: true,
                            count: "exact",
                        },
                    )
                    .eq(
                        "organization_id",
                        organizationId,
                    ),
            ),

            this.count(
                this.supabase
                    .from("permissions")
                    .select(
                        "id",
                        {
                            head: true,
                            count: "exact",
                        },
                    )
                    .eq(
                        "organization_id",
                        organizationId,
                    ),
            ),

            this.count(
                this.supabase
                    .from("audit_logs")
                    .select(
                        "id",
                        {
                            head: true,
                            count: "exact",
                        },
                    )
                    .eq(
                        "organization_id",
                        organizationId,
                    ),
            ),

            this.count(
                this.supabase
                    .from("module_registry")
                    .select(
                        "id",
                        {
                            head: true,
                            count: "exact",
                        },
                    ),
            ),

            this.count(
                this.supabase
                    .from("module_registry")
                    .select(
                        "id",
                        {
                            head: true,
                            count: "exact",
                        },
                    )
                    .eq(
                        "is_enabled",
                        true,
                    ),
            ),
        ]);


        this.throwIfError(
            organizationResult,
            "Failed to load organization count.",
        );

        this.throwIfError(
            usersResult,
            "Failed to load user count.",
        );

        this.throwIfError(
            activeUsersResult,
            "Failed to load active user count.",
        );

        this.throwIfError(
            rolesResult,
            "Failed to load role count.",
        );

        this.throwIfError(
            permissionsResult,
            "Failed to load permission count.",
        );

        this.throwIfError(
            auditsResult,
            "Failed to load audit count.",
        );

        this.throwIfError(
            modulesResult,
            "Failed to load module count.",
        );

        this.throwIfError(
            enabledModulesResult,
            "Failed to load enabled module count.",
        );


        return {
            generatedAt:
                new Date().toISOString(),

            summary: {
                organizations:
                    organizationResult.count ?? 0,

                users:
                    usersResult.count ?? 0,

                activeUsers:
                    activeUsersResult.count ?? 0,

                modules:
                    modulesResult.count ?? 0,

                enabledModules:
                    enabledModulesResult.count ?? 0,

                roles:
                    rolesResult.count ?? 0,

                permissions:
                    permissionsResult.count ?? 0,

                audits:
                    auditsResult.count ?? 0,
            },
        };
    }


    private async count(
        query: PromiseLike<{
            count: number | null;
            error: unknown;
        }>,
    ): Promise<CountResult> {

        const result =
            await query;

        return {
            count:
                result.count,

            error:
                result.error,
        };
    }


    private throwIfError(
        result: CountResult,
        message: string,
    ): void {

        if (result.error) {
            throw new Error(
                `${message} ${this.errorMessage(result.error)}`,
            );
        }
    }


    private errorMessage(
        error: unknown,
    ): string {

        if (error instanceof Error) {
            return error.message;
        }

        if (
            typeof error === "object" &&
            error !== null &&
            "message" in error &&
            typeof error.message === "string"
        ) {
            return error.message;
        }

        return "Unknown Supabase error.";
    }
}