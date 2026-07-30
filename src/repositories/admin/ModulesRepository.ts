/**
 * ============================================================================
 * Platform Modules Repository
 * Production Supabase Repository
 * ============================================================================
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { BaseRepository } from "@/lib/db/base-repository";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import type { PlatformModule } from "@/types/admin/Module";

export interface IModulesRepository {
  list(): Promise<PlatformModule[]>;
  findById(id: string): Promise<PlatformModule | null>;
  findByCode(code: string): Promise<PlatformModule | null>;
  save(module: PlatformModule): Promise<void>;
  delete(id: string): Promise<void>;
}

type ModuleRegistryRow = {
  id: string;
  module_code: string;
  module_name: string;
  module_type: string | null;
  description: string | null;
  enabled: boolean | null;
  display_order: number | null;
  configuration: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export class ModulesRepository
  extends BaseRepository<PlatformModule>
  implements IModulesRepository
{
  constructor(
    supabase: SupabaseClient
  ) {
    super(
      supabase,
      "module_registry"
    );
  }

  static async create(): Promise<ModulesRepository> {
    const supabase =
      await createSupabaseServerClient();

    return new ModulesRepository(
      supabase
    );
  }

  private mapToDomain(
    row: ModuleRegistryRow
  ): PlatformModule {
    return {
      id: row.id,

      code: row.module_code,

      name: row.module_name,

      description:
        row.description ?? undefined,

      category:
        this.resolveCategory(row.module_type),

      version: "1.0",

      deploymentType: "Core",

      route: "",

      displayOrder:
        row.display_order ?? 0,

      dependencies: [],

      featureFlags: [],

      enabledByDefault: true,

      tenantConfigurable: false,

      licenseRequired: false,

      supportsCRM: false,

      supportsERP: false,

      supportsStandalone: true,

      supportsEnterprise: true,

      status:
        row.enabled
          ? "Active"
          : "Inactive",

      isSystem: true,

      metadata:
        row.configuration ?? {},

      createdAt:
        row.created_at,

      updatedAt:
        row.updated_at,
    };
  }

  private resolveCategory(
    type: string | null
  ): PlatformModule["category"] {
    switch (
      type?.toUpperCase()
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

      case "ADMINISTRATION":
      case "ADMIN":
        return "Administration";

      default:
        return "Platform";
    }
  }

  async list(): Promise<PlatformModule[]> {
    const { data, error } =
      await this.tableRef()
        .select("*")
        .order(
          "display_order",
          {
            ascending: true,
          }
        );

    if (error) {
      throw error;
    }

    return (
      data ?? []
    ).map(
      (row: ModuleRegistryRow) =>
        this.mapToDomain(row)
    );
  }

  async findById(
    id: string
  ): Promise<PlatformModule | null> {
    const { data, error } =
      await this.tableRef()
        .select("*")
        .eq(
          "id",
          id
        )
        .maybeSingle();

    if (error) {
      throw error;
    }

    return data
      ? this.mapToDomain(
          data as ModuleRegistryRow
        )
      : null;
  }

  async findByCode(
    code: string
  ): Promise<PlatformModule | null> {
    const { data, error } =
      await this.tableRef()
        .select("*")
        .eq(
          "module_code",
          code
        )
        .maybeSingle();

    if (error) {
      throw error;
    }

    return data
      ? this.mapToDomain(
          data as ModuleRegistryRow
        )
      : null;
  }

  async save(
    module: PlatformModule
  ): Promise<void> {
    const { error } =
      await this.tableRef()
        .upsert(
          {
            module_code:
              module.code,

            module_name:
              module.name,

            module_type:
              module.category,

            description:
              module.description ?? null,

            enabled:
              module.status === "Active",

            display_order:
              module.displayOrder,

            configuration:
              module.metadata ?? {},
          },
          {
            onConflict:
              "module_code",
          }
        );

    if (error) {
      throw error;
    }
  }

  async delete(
    id: string
  ): Promise<void> {
    const { error } =
      await this.tableRef()
        .delete()
        .eq(
          "id",
          id
        );

    if (error) {
      throw error;
    }
  }
}