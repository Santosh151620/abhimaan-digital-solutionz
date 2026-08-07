/**
 * ============================================================================
 * Platform Modules Repository
 *
 * Admin Module Registry
 *
 * Architecture:
 *
 * ModuleService
 *        ↓
 * ModulesRepository
 *        ↓
 * BaseRepository
 *        ↓
 * module_registry
 *
 * Production rules:
 * - Server-side Supabase client only
 * - Tenant isolation through BaseRepository
 * - No caller-supplied organization_id
 * - Stable domain mapping
 * - Validated identifiers and module codes
 * - No silent loss of persisted module configuration
 * ============================================================================
 */

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
    PlatformModule,
} from "@/types/admin/Module";



type ModuleRegistryRow = {

    id: string;

    organization_id: string;

    module_code: string;

    module_name: string;

    module_type: string | null;

    description: string | null;

    version: string | null;

    deployment_type: string | null;

    route: string | null;

    icon: string | null;

    enabled: boolean | null;

    display_order: number | null;

    dependencies: string[] | null;

    feature_flags: string[] | null;

    enabled_by_default: boolean | null;

    tenant_configurable: boolean | null;

    license_required: boolean | null;

    supports_crm: boolean | null;

    supports_erp: boolean | null;

    supports_standalone: boolean | null;

    supports_enterprise: boolean | null;

    status: string | null;

    is_system: boolean | null;

    configuration: Record<string, unknown> | null;

    created_at: string;

    updated_at: string;

};



export interface IModulesRepository {

    list(): Promise<PlatformModule[]>;

    findById(
        id: string,
    ): Promise<PlatformModule | null>;

    findByCode(
        code: string,
    ): Promise<PlatformModule | null>;

    save(
        module: PlatformModule,
    ): Promise<PlatformModule>;

    delete(
        id: string,
    ): Promise<void>;

}



export class ModulesRepository
    extends BaseRepository<PlatformModule>
    implements IModulesRepository {


    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            "module_registry",
        );

    }


    static async create(): Promise<ModulesRepository> {

        const supabase =
            await createSupabaseServerClient();

        return new ModulesRepository(
            supabase,
        );

    }


    async list(): Promise<PlatformModule[]> {

        const {
            data,
            error,
        } =
            await this
                .tableRef()
                .select("*")
                .order(
                    "display_order",
                    {
                        ascending: true,
                    },
                );

        if (error) {
            throw error;
        }

        return (data ?? []).map(
            row =>
                this.mapToDomain(
                    row as ModuleRegistryRow,
                ),
        );

    }


    async findById(
        id: string,
    ): Promise<PlatformModule | null> {

        const normalizedId =
            this.requireId(id);

        const {
            data,
            error,
        } =
            await this
                .tableRef()
                .select("*")
                .eq(
                    "id",
                    normalizedId,
                )
                .maybeSingle();

        if (error) {
            throw error;
        }

        return data
            ? this.mapToDomain(
                data as ModuleRegistryRow,
            )
            : null;

    }


    async findByCode(
        code: string,
    ): Promise<PlatformModule | null> {

        const normalizedCode =
            this.requireCode(code);

        const {
            data,
            error,
        } =
            await this
                .tableRef()
                .select("*")
                .eq(
                    "module_code",
                    normalizedCode,
                )
                .maybeSingle();

        if (error) {
            throw error;
        }

        return data
            ? this.mapToDomain(
                data as ModuleRegistryRow,
            )
            : null;

    }


    async save(
        module: PlatformModule,
    ): Promise<PlatformModule> {

        if (!module) {
            throw new Error(
                "Module is required.",
            );
        }

        const id =
            this.requireId(module.id);

        const code =
            this.requireCode(module.code);

        const name =
            module.name?.trim();

        if (!name) {
            throw new Error(
                "Module name is required.",
            );
        }

        const now =
            new Date().toISOString();

        const {
            data,
            error,
        } =
            await this
                .tableRef()
                .upsert(
                    {
                        id,

                        organization_id:
                            this.organizationId,

                        module_code:
                            code,

                        module_name:
                            name,

                        module_type:
                            module.category,

                        description:
                            module.description?.trim()
                            ?? null,

                        version:
                            module.version,

                        deployment_type:
                            module.deploymentType,

                        route:
                            module.route?.trim()
                            ?? null,

                        icon:
                            module.icon?.trim()
                            ?? null,

                        enabled:
                            module.status === "Active",

                        display_order:
                            module.displayOrder,

                        dependencies:
                            module.dependencies ?? [],

                        feature_flags:
                            module.featureFlags ?? [],

                        enabled_by_default:
                            module.enabledByDefault,

                        tenant_configurable:
                            module.tenantConfigurable,

                        license_required:
                            module.licenseRequired,

                        supports_crm:
                            module.supportsCRM,

                        supports_erp:
                            module.supportsERP,

                        supports_standalone:
                            module.supportsStandalone,

                        supports_enterprise:
                            module.supportsEnterprise,

                        status:
                            module.status,

                        is_system:
                            module.isSystem,

                        configuration:
                            module.metadata ?? {},

                        created_at:
                            module.createdAt ?? now,

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
                "Module save returned no data.",
            );
        }

        return this.mapToDomain(
            data as ModuleRegistryRow,
        );

    }


    async delete(
        id: string,
    ): Promise<void> {

        await super.delete(
            this.requireId(id),
        );

    }


    private requireId(
        id: string,
    ): string {

        const normalizedId =
            id?.trim();

        if (!normalizedId) {
            throw new Error(
                "Module id is required.",
            );
        }

        return normalizedId;

    }


    private requireCode(
        code: string,
    ): string {

        const normalizedCode =
            code?.trim().toUpperCase();

        if (!normalizedCode) {
            throw new Error(
                "Module code is required.",
            );
        }

        return normalizedCode;

    }


    private mapToDomain(
        row: ModuleRegistryRow,
    ): PlatformModule {

        return {

            id:
                row.id,

            organizationId:
                row.organization_id,

            code:
                row.module_code,

            name:
                row.module_name,

            description:
                row.description
                ?? undefined,

            category:
                this.resolveCategory(
                    row.module_type,
                ),

            version:
                row.version
                ?? "1.0",

            deploymentType:
                this.resolveDeploymentType(
                    row.deployment_type,
                ),

            route:
                row.route
                ?? "",

            icon:
                row.icon
                ?? undefined,

            displayOrder:
                row.display_order
                ?? 0,

            dependencies:
                row.dependencies
                ?? [],

            featureFlags:
                row.feature_flags
                ?? [],

            enabledByDefault:
                row.enabled_by_default
                ?? true,

            tenantConfigurable:
                row.tenant_configurable
                ?? false,

            licenseRequired:
                row.license_required
                ?? false,

            supportsCRM:
                row.supports_crm
                ?? false,

            supportsERP:
                row.supports_erp
                ?? false,

            supportsStandalone:
                row.supports_standalone
                ?? true,

            supportsEnterprise:
                row.supports_enterprise
                ?? true,

            status:
                this.resolveStatus(
                    row.status,
                    row.enabled,
                ),

            isSystem:
                row.is_system
                ?? true,

            metadata:
                row.configuration
                ?? {},

            createdAt:
                row.created_at,

            updatedAt:
                row.updated_at,

        };

    }


    private resolveCategory(
        value: string | null,
    ): PlatformModule["category"] {

        switch (
            value?.trim().toUpperCase()
        ) {

            case "CRM":
                return "CRM";

            case "ERP":
                return "ERP";

            case "AI":
                return "AI";

            case "INTEGRATION":
                return "Integration";

            case "REPORTING":
                return "Reporting";

            case "ADMIN":
            case "ADMINISTRATION":
                return "Administration";

            default:
                return "Platform";

        }

    }


    private resolveDeploymentType(
        value: string | null,
    ): PlatformModule["deploymentType"] {

        switch (
            value?.trim().toUpperCase()
        ) {

            case "OPTIONAL":
                return "Optional";

            case "EXTENSION":
                return "Extension";

            case "CORE":
            default:
                return "Core";

        }

    }


    private resolveStatus(
        value: string | null,
        enabled: boolean | null,
    ): PlatformModule["status"] {

        switch (
            value?.trim().toUpperCase()
        ) {

            case "INACTIVE":
                return "Inactive";

            case "PREVIEW":
                return "Preview";

            case "DEPRECATED":
                return "Deprecated";

            case "ACTIVE":
                return "Active";

            default:
                return enabled
                    ? "Active"
                    : "Inactive";

        }

    }

}