/**
 * ============================================================================
 * ADS Settings Repository
 *
 * Organization-scoped platform settings repository.
 *
 * Storage:
 * organization_settings
 *
 * Existing database contract:
 * - id
 * - organization_id
 * - setting_key
 * - setting_value
 * - category
 * - description
 * - created_at
 * - updated_at
 *
 * Repository responsibilities:
 * - Enforce organization scoping through BaseRepository.
 * - Read and write only columns that actually exist in organization_settings.
 * - Normalize and validate setting keys.
 * - Validate supported setting categories.
 * - Map database rows into the PlatformSetting domain contract.
 * - Keep database implementation details out of callers.
 *
 * Important:
 * - organization_id is always derived from BaseRepository / tenant context.
 * - organizationId supplied by a PlatformSetting is never used for persistence.
 * - created_at / updated_at remain database controlled.
 * - Domain-only fields are reconstructed during database-to-domain mapping.
 * - No theme-specific table or settings table is introduced.
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
    SettingValueType,
} from "@/types/admin/Settings";





type OrganizationSettingRow = {

    id: string;

    organization_id: string;

    setting_key: string;

    setting_value: unknown;

    category: string | null;

    description: string | null;

    created_at: string | null;

    updated_at: string | null;

};





export interface ISettingsRepository {

    list():
        Promise<PlatformSetting[]>;


    find(
        category: SettingCategory,
        key: string,
    ):
        Promise<PlatformSetting | null>;


    save(
        setting: PlatformSetting,
    ):
        Promise<void>;


    findByCategory(
        category: SettingCategory,
    ):
        Promise<{
            category: SettingCategory;
            settings: PlatformSetting[];
        }>;


    findByKey(
        key: string,
    ):
        Promise<PlatformSetting | null>;

}





export class SettingsRepository
    extends BaseRepository<PlatformSetting>
    implements ISettingsRepository {


    private static readonly categories:
        readonly SettingCategory[] =
        [

            "General",

            "Security",

            "Authentication",

            "Branding",

            "Localization",

            "Notification",

            "Email",

            "Storage",

            "AI",

            "Integration",

            "Workflow",

            "CRM",

            "Reporting",

            "Billing",

            "System",

        ];


    private static readonly keyPattern =
        /^[a-zA-Z0-9._:-]+$/;


    private static readonly maxKeyLength =
        255;





    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            "organization_settings",
        );

    }





    /**
     * Return every setting belonging to the current organization.
     *
     * Tenant isolation is enforced by the repository's organizationId.
     */
    async list():
        Promise<PlatformSetting[]> {


        const {
            data,
            error,
        } =
            await this
                .tableRef()
                .select(
                    [
                        "id",
                        "organization_id",
                        "setting_key",
                        "setting_value",
                        "category",
                        "description",
                        "created_at",
                        "updated_at",
                    ].join(","),
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .order(
                    "category",
                    {
                        ascending: true,
                    },
                )
                .order(
                    "setting_key",
                    {
                        ascending: true,
                    },
                );


        if (error) {

            throw error;

        }


        const rows =
            this.toRows(
                data,
            );


        return rows.map(
            row =>
                this.mapRow(
                    row,
                ),
        );

    }





    /**
     * Find one setting by category and key.
     */
    async find(
        category: SettingCategory,
        key: string,
    ):
        Promise<PlatformSetting | null> {


        const normalizedCategory =
            this.requireCategory(
                category,
            );


        const normalizedKey =
            this.requireKey(
                key,
            );


        const {
            data,
            error,
        } =
            await this
                .tableRef()
                .select(
                    [
                        "id",
                        "organization_id",
                        "setting_key",
                        "setting_value",
                        "category",
                        "description",
                        "created_at",
                        "updated_at",
                    ].join(","),
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "category",
                    normalizedCategory,
                )
                .eq(
                    "setting_key",
                    normalizedKey,
                )
                .order(
                    "updated_at",
                    {
                        ascending: false,
                    },
                )
                .limit(
                    1,
                );


        if (error) {

            throw error;

        }


        const rows =
            this.toRows(
                data,
            );


        const row =
            rows[0];


        if (!row) {

            return null;

        }


        return this.mapRow(
            row,
        );

    }





    /**
     * Create or update a setting inside the current organization.
     *
     * The incoming organizationId is deliberately ignored.
     *
     * Persistence is restricted to the actual organization_settings
     * columns. Domain-only fields such as isSystem, isReadonly,
     * isEncrypted, metadata, etc. are not fabricated into the database.
     */
    async save(
        setting: PlatformSetting,
    ):
        Promise<void> {


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


        const name =
            typeof setting.name === "string"
                ? setting.name.trim()
                : "";


        if (!name) {

            throw new Error(
                "Setting name is required.",
            );

        }


        if (
            !setting.scope
        ) {

            throw new Error(
                "Setting scope is required.",
            );

        }


        if (
            !setting.valueType
        ) {

            throw new Error(
                "Setting value type is required.",
            );

        }


        /*
         * organization_settings does not contain the PlatformSetting
         * presentation/domain fields. Persist only the existing schema.
         */
        const payload = {

            organization_id:
                this.organizationId,

            setting_key:
                key,

            setting_value:
                setting.value,

            category:
                category,

            description:
                setting.description?.trim() ||
                null,

        };


        /*
         * Look up the current organization-scoped record first.
         *
         * This deliberately scopes both the lookup and subsequent
         * mutation to the current organization.
         */
        const {
            data: existingData,
            error: existingError,
        } =
            await this
                .tableRef()
                .select(
                    "id",
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "setting_key",
                    key,
                )
                .order(
                    "updated_at",
                    {
                        ascending: false,
                    },
                )
                .limit(
                    1,
                );


        if (existingError) {

            throw existingError;

        }


        const existingRows =
            (existingData ?? []) as Array<{
                id: string;
            }>;


        const existing =
            existingRows[0];


        if (existing) {

            const {
                error:
                    updateError,
            } =
                await this
                    .tableRef()
                    .update({

                        setting_key:
                            payload.setting_key,

                        setting_value:
                            payload.setting_value,

                        category:
                            payload.category,

                        description:
                            payload.description,

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
            error:
                insertError,
        } =
            await this
                .tableRef()
                .insert(
                    payload,
                );


        if (insertError) {

            throw insertError;

        }

    }





    /**
     * Return all settings for one supported category.
     */
    async findByCategory(
        category: SettingCategory,
    ):
        Promise<{
            category: SettingCategory;
            settings: PlatformSetting[];
        }> {


        const normalizedCategory =
            this.requireCategory(
                category,
            );


        const {
            data,
            error,
        } =
            await this
                .tableRef()
                .select(
                    [
                        "id",
                        "organization_id",
                        "setting_key",
                        "setting_value",
                        "category",
                        "description",
                        "created_at",
                        "updated_at",
                    ].join(","),
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "category",
                    normalizedCategory,
                )
                .order(
                    "setting_key",
                    {
                        ascending: true,
                    },
                );


        if (error) {

            throw error;

        }


        const rows =
            this.toRows(
                data,
            );


        return {

            category:
                normalizedCategory,

            settings:
                rows.map(
                    row =>
                        this.mapRow(
                            row,
                        ),
                ),

        };

    }





    /**
     * Find one setting by key inside the current organization.
     */
    async findByKey(
        key: string,
    ):
        Promise<PlatformSetting | null> {


        const normalizedKey =
            this.requireKey(
                key,
            );


        const {
            data,
            error,
        } =
            await this
                .tableRef()
                .select(
                    [
                        "id",
                        "organization_id",
                        "setting_key",
                        "setting_value",
                        "category",
                        "description",
                        "created_at",
                        "updated_at",
                    ].join(","),
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "setting_key",
                    normalizedKey,
                )
                .order(
                    "updated_at",
                    {
                        ascending: false,
                    },
                )
                .limit(
                    1,
                );


        if (error) {

            throw error;

        }


        const rows =
            this.toRows(
                data,
            );


        const row =
            rows[0];


        if (!row) {

            return null;

        }


        return this.mapRow(
            row,
        );

    }





    /**
     * Convert an unknown Supabase response into the repository row contract.
     */
    private toRows(
        data: unknown,
    ):
        OrganizationSettingRow[] {


        if (!Array.isArray(data)) {

            return [];

        }


        return data as OrganizationSettingRow[];

    }





    /**
     * Map an organization_settings row into the PlatformSetting domain model.
     *
     * organization_settings is intentionally smaller than PlatformSetting.
     * Domain-only properties therefore receive safe deterministic defaults.
     */
    private mapRow(
        row: OrganizationSettingRow,
    ):
        PlatformSetting {


        const category =
            this.mapCategory(
                row.category,
            );


        const value =
            row.setting_value;


        return {

            id:
                row.id,

            organizationId:
                row.organization_id,

            entityType:
                "PlatformSetting",

            scope:
                "Organization",

            category,

            key:
                this.normalizeKey(
                    row.setting_key,
                ),

            name:
                row.setting_key,

            description:
                row.description ??
                undefined,

            value:
                value as PlatformSetting["value"],

            valueType:
                this.resolveValueType(
                    value,
                ),

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
                row.created_at ??
                "",

            updatedAt:
                row.updated_at ??
                "",

        };

    }





    /**
     * Convert an existing database category into a safe domain category.
     *
     * organization_settings.category is currently free-form in the
     * persistence contract, so unknown legacy values are contained at
     * the domain boundary rather than being exposed as invalid types.
     */
    private mapCategory(
        category: string | null,
    ):
        SettingCategory {


        if (!category) {

            return "General";

        }


        const normalized =
            category.trim();


        if (
            SettingsRepository.categories.includes(
                normalized as SettingCategory,
            )
        ) {

            return normalized as SettingCategory;

        }


        return "General";

    }





    /**
     * Resolve the UI/domain value type from the persisted JSON value.
     */
    private resolveValueType(
        value: unknown,
    ):
        SettingValueType {


        if (
            typeof value === "string"
        ) {

            return "String";

        }


        if (
            typeof value === "number" &&
            Number.isFinite(value)
        ) {

            return "Number";

        }


        if (
            typeof value === "boolean"
        ) {

            return "Boolean";

        }


        if (
            Array.isArray(value)
        ) {

            return "Array";

        }


        return "Json";

    }





    /**
     * Validate and normalize a setting category before persistence/query.
     */
    private requireCategory(
        category: SettingCategory,
    ):
        SettingCategory {


        if (
            !category ||
            !String(category).trim()
        ) {

            throw new Error(
                "Setting category is required.",
            );

        }


        const normalized =
            String(category).trim();


        if (
            !SettingsRepository.categories.includes(
                normalized as SettingCategory,
            )
        ) {

            throw new Error(
                `Unsupported setting category: ${normalized}`,
            );

        }


        return normalized as SettingCategory;

    }





    /**
     * Validate and normalize a setting key.
     *
     * Keys are intentionally normalized to lowercase so callers cannot
     * accidentally create logically duplicated keys such as:
     *
     *     Theme.Policy
     *     theme.policy
     */
    private requireKey(
        key: string,
    ):
        string {


        const normalizedKey =
            this.normalizeKey(
                key,
            );


        if (!normalizedKey) {

            throw new Error(
                "Setting key is required.",
            );

        }


        if (
            normalizedKey.length >
            SettingsRepository.maxKeyLength
        ) {

            throw new Error(
                "Setting key must not exceed 255 characters.",
            );

        }


        if (
            !SettingsRepository.keyPattern.test(
                normalizedKey,
            )
        ) {

            throw new Error(
                "Setting key may contain only letters, numbers, dots, underscores, colons, and hyphens.",
            );

        }


        return normalizedKey;

    }





    /**
     * Normalize a setting key without performing validation.
     */
    private normalizeKey(
        key: string,
    ):
        string {


        return typeof key === "string"
            ? key.trim().toLowerCase()
            : "";

    }

}