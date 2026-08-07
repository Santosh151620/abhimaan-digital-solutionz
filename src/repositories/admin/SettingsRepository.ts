/**
 * ============================================================================
 * ADS Settings Repository
 *
 * Organization-scoped platform settings.
 *
 * Storage:
 * organization_settings
 *
 * Production guarantees:
 * - Tenant scope comes from BaseRepository / TenantContextManager.
 * - Caller cannot provide organization_id.
 * - All reads are tenant-scoped.
 * - All writes are tenant-scoped.
 * - Setting keys are validated.
 * - Domain mapping is centralized.
 * - Raw database rows are never returned as domain objects.
 * ============================================================================
 */

import type {
    SupabaseClient,
} from "@supabase/supabase-js";

import {
    BaseRepository,
} from "@/lib/db/base-repository";

import type {
    PlatformSetting,
    SettingCategory,
} from "@/types/admin/Settings";


type OrganizationSettingRow = {

    id: string;

    organization_id: string;

    setting_category: SettingCategory;

    settings: Record<string, unknown> | null;

    created_at: string | null;

    updated_at: string | null;

};


export interface ISettingsRepository {

    list(): Promise<PlatformSetting[]>;

    find(
        category: SettingCategory,
        key: string,
    ): Promise<PlatformSetting | null>;

    save(
        setting: PlatformSetting,
    ): Promise<void>;

    findByCategory(
        category: SettingCategory,
    ): Promise<{
        category: SettingCategory;
        settings: PlatformSetting[];
    }>;

    findByKey(
        key: string,
    ): Promise<PlatformSetting | null>;

}


export class SettingsRepository
    extends BaseRepository<PlatformSetting>
    implements ISettingsRepository {

    constructor(
        supabase: SupabaseClient,
    ) {
        super(
            supabase,
            "organization_settings",
        );
    }


    async list(): Promise<PlatformSetting[]> {

        const {
            data,
            error,
        } =
            await this
                .tableRef()
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .order(
                    "setting_category",
                    {
                        ascending: true,
                    },
                );

        if (error) {
            throw error;
        }

        const rows =
            (data ?? []) as unknown as OrganizationSettingRow[];

        return rows.flatMap(
            row =>
                this.mapRow(row),
        );
    }


    async find(
        category: SettingCategory,
        key: string,
    ): Promise<PlatformSetting | null> {

        const normalizedCategory =
            this.requireCategory(category);

        const normalizedKey =
            this.requireKey(key);

        const {
            data,
            error,
        } =
            await this
                .tableRef()
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "setting_category",
                    normalizedCategory,
                )
                .maybeSingle();

        if (error) {
            throw error;
        }

        if (!data) {
            return null;
        }

        const row =
            data as unknown as OrganizationSettingRow;

        if (
            !Object.prototype.hasOwnProperty.call(
                row.settings ?? {},
                normalizedKey,
            )
        ) {
            return null;
        }

        return this.mapSetting(
            row,
            normalizedKey,
        );
    }


    async save(
        setting: PlatformSetting,
    ): Promise<void> {

        if (!setting) {
            throw new Error(
                "Setting is required.",
            );
        }

        const category =
            this.requireCategory(
                setting.category,
            );

        const key =
            this.requireKey(
                setting.key,
            );

        const {
            data,
            error,
        } =
            await this
                .tableRef()
                .select(
                    "id, settings",
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "setting_category",
                    category,
                )
                .maybeSingle();

        if (error) {
            throw error;
        }

        const existing =
            data as unknown as {
                id: string;
                settings:
                    Record<string, unknown> | null;
            } | null;

        const settings:
            Record<string, unknown> =
            {
                ...(existing?.settings ?? {}),
                [key]:
                    setting.value,
            };

        const now =
            new Date().toISOString();

        if (existing) {

            const {
                error: updateError,
            } =
                await this
                    .tableRef()
                    .update({
                        settings,
                        updated_at: now,
                    })
                    .eq(
                        "organization_id",
                        this.organizationId,
                    )
                    .eq(
                        "id",
                        existing.id,
                    );

            if (updateError) {
                throw updateError;
            }

            return;
        }

        const {
            error: insertError,
        } =
            await this
                .tableRef()
                .insert({
                    organization_id:
                        this.organizationId,

                    setting_category:
                        category,

                    settings,

                    created_at:
                        now,

                    updated_at:
                        now,
                });

        if (insertError) {
            throw insertError;
        }
    }


    async findByCategory(
        category: SettingCategory,
    ): Promise<{
        category: SettingCategory;
        settings: PlatformSetting[];
    }> {

        const normalizedCategory =
            this.requireCategory(category);

        const {
            data,
            error,
        } =
            await this
                .tableRef()
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "setting_category",
                    normalizedCategory,
                )
                .maybeSingle();

        if (error) {
            throw error;
        }

        if (!data) {
            return {
                category:
                    normalizedCategory,

                settings: [],
            };
        }

        const row =
            data as unknown as OrganizationSettingRow;

        return {
            category:
                normalizedCategory,

            settings:
                this.mapRow(row),
        };
    }


    async findByKey(
        key: string,
    ): Promise<PlatformSetting | null> {

        const normalizedKey =
            this.requireKey(key);

        const {
            data,
            error,
        } =
            await this
                .tableRef()
                .select("*")
                .eq(
                    "organization_id",
                    this.organizationId,
                );

        if (error) {
            throw error;
        }

        const rows =
            (data ?? []) as unknown as OrganizationSettingRow[];

        for (const row of rows) {

            if (
                Object.prototype.hasOwnProperty.call(
                    row.settings ?? {},
                    normalizedKey,
                )
            ) {
                return this.mapSetting(
                    row,
                    normalizedKey,
                );
            }
        }

        return null;
    }


    private mapRow(
        row: OrganizationSettingRow,
    ): PlatformSetting[] {

        const settings =
            row.settings ?? {};

        return Object.keys(
            settings,
        ).map(
            key =>
                this.mapSetting(
                    row,
                    key,
                ),
        );
    }


    private mapSetting(
        row: OrganizationSettingRow,
        key: string,
    ): PlatformSetting {

        const value =
            row.settings?.[key];

        const setting: PlatformSetting = {
            id:
                row.id,

            organizationId:
                row.organization_id,

            entityType:
                "PlatformSetting",

            scope:
                "Organization",

            category:
                row.setting_category,

            key,

            name:
                key,

            description:
                undefined,

            value:
                value as PlatformSetting["value"],

            valueType:
                "Json",

            isSystem:
                false,

            isReadonly:
                false,

            isEncrypted:
                false,

            isVisible:
                true,

            isActive:
                true,

            metadata:
                {},

            createdAt:
                row.created_at ?? "",

            updatedAt:
                row.updated_at ?? "",
        };

        return setting;
    }


    private requireCategory(
        category: SettingCategory,
    ): SettingCategory {

        if (!category) {
            throw new Error(
                "Setting category is required.",
            );
        }

        return category;
    }


    private requireKey(
        key: string,
    ): string {

        const normalizedKey =
            key?.trim();

        if (!normalizedKey) {
            throw new Error(
                "Setting key is required.",
            );
        }

        return normalizedKey;
    }

}