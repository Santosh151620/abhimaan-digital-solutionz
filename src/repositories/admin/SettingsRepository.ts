import type {
    SupabaseClient,
} from "@supabase/supabase-js";


import {
    BaseRepository,
} from "@/lib/db/base-repository";


import type {
    PlatformSetting,
    SettingCategory,
    SettingGroup,
    SettingValueType,
} from "@/types/admin/Settings";



/**
 * ============================================================================
 * ADS ADMIN — SETTINGS REPOSITORY
 * ============================================================================
 *
 * Persistence boundary for the existing organization_settings table.
 *
 * IMPORTANT:
 * - This repository is ADMIN/PLATFORM scoped.
 * - It is intentionally separate from the CRM SettingsRepository.
 * - Tenant isolation is provided by BaseRepository.organizationId and is
 *   reinforced explicitly on every organization_settings query/mutation.
 * - organization_id is NEVER accepted from a client as an authoritative
 *   tenant identifier.
 * - Only columns that actually exist in organization_settings are persisted.
 * - PlatformSetting remains the application/domain contract.
 * - Database-specific fields remain isolated in OrganizationSettingRow.
 *
 * Current persistence contract:
 *
 * organization_settings
 * ├── id
 * ├── organization_id
 * ├── setting_key
 * ├── setting_value
 * ├── category
 * ├── description
 * ├── created_at
 * └── updated_at
 *
 * Domain-only PlatformSetting properties such as isSystem, isReadonly,
 * isEncrypted, isVisible, isActive, metadata, etc. are deliberately not
 * fabricated into the database.
 * ============================================================================
 */


/* ============================================================================
 * DATABASE ROW CONTRACT
 * ========================================================================== */

interface OrganizationSettingRow {

    id:
        string;

    organization_id:
        string;

    setting_key:
        string;

    setting_value:
        unknown;

    category:
        string | null;

    description:
        string | null;

    created_at:
        string | null;

    updated_at:
        string | null;

}



/* ============================================================================
 * REPOSITORY CONTRACT
 * ========================================================================== */

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
        Promise<SettingGroup>;


    findByKey(
        key: string,
    ):
        Promise<PlatformSetting | null>;

}



/* ============================================================================
 * REPOSITORY IMPLEMENTATION
 * ========================================================================== */

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
        /^[a-z0-9._:-]+$/;


    private static readonly maxKeyLength =
        255;


    private static readonly maxNameLength =
        255;


    private static readonly selectedColumns =
        [

            "id",

            "organization_id",

            "setting_key",

            "setting_value",

            "category",

            "description",

            "created_at",

            "updated_at",

        ].join(",");



    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            "organization_settings",
        );

    }



    /* ========================================================================
     * PUBLIC READ OPERATIONS
     * ====================================================================== */


    /**
     * Return every setting belonging to the current organization.
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
                    SettingsRepository.selectedColumns,
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


        if (
            error
        ) {

            throw error;

        }


        return this
            .toRows(
                data,
            )
            .map(
                row =>
                    this.mapRow(
                        row,
                    ),
            );

    }



    /**
     * Find one setting by category and key.
     *
     * The current persistence contract treats setting_key as the
     * organization-scoped identity. Category is additionally checked here
     * because this method explicitly promises category + key lookup.
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
                    SettingsRepository.selectedColumns,
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


        if (
            error
        ) {

            throw error;

        }


        const row =
            this
                .toRows(
                    data,
                )[0];


        if (
            !row
        ) {

            return null;

        }


        return this.mapRow(
            row,
        );

    }



    /**
     * Find one setting by organization-scoped key.
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
                    SettingsRepository.selectedColumns,
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


        if (
            error
        ) {

            throw error;

        }


        const row =
            this
                .toRows(
                    data,
                )[0];


        if (
            !row
        ) {

            return null;

        }


        return this.mapRow(
            row,
        );

    }



    /**
     * Return all settings belonging to one supported category.
     */
    async findByCategory(
        category: SettingCategory,
    ):
        Promise<SettingGroup> {

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
                    SettingsRepository.selectedColumns,
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


        if (
            error
        ) {

            throw error;

        }


        return {

            category:
                normalizedCategory,

            settings:
                this
                    .toRows(
                        data,
                    )
                    .map(
                        row =>
                            this.mapRow(
                                row,
                            ),
                    ),

        };

    }



    /* ========================================================================
     * PUBLIC WRITE OPERATIONS
     * ====================================================================== */


    /**
     * Create or update an organization-scoped setting.
     *
     * The incoming organizationId is deliberately ignored.
     *
     * Only actual organization_settings columns are persisted.
     *
     * The operation is implemented as an explicit read-then-update/insert
     * rather than a fabricated upsert because the existing repository contract
     * must not assume a particular composite unique constraint beyond the
     * existing schema.
     */
    async save(
        setting: PlatformSetting,
    ):
        Promise<void> {

        const validated =
            this.validateSetting(
                setting,
            );


        const payload = {

            organization_id:
                this.organizationId,

            setting_key:
                validated.key,

            setting_value:
                validated.value,

            category:
                validated.category,

            description:
                validated.description?.trim() ||
                null,

        };


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
                    validated.key,
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


        if (
            existingError
        ) {

            throw existingError;

        }


        const existing =
            this
                .toIdRows(
                    existingData,
                )[0];


        if (
            existing
        ) {

            const {
                error,
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


            if (
                error
            ) {

                throw this.translatePersistenceError(
                    error,
                );

            }


            return;

        }


        const {
            error,
        } =
            await this
                .tableRef()
                .insert(
                    payload,
                );


        if (
            error
        ) {

            throw this.translatePersistenceError(
                error,
            );

        }

    }



    /* ========================================================================
     * VALIDATION
     * ====================================================================== */


    /**
     * Validate the complete application-level setting contract before any
     * persistence operation.
     *
     * organizationId is intentionally not validated here as a tenant source.
     * BaseRepository.organizationId remains authoritative.
     */
    private validateSetting(
        setting: PlatformSetting,
    ):
        PlatformSetting {

        if (
            !setting
        ) {

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


        if (
            !name
        ) {

            throw new Error(
                "Setting name is required.",
            );

        }


        if (
            name.length >
            SettingsRepository.maxNameLength
        ) {

            throw new Error(
                "Setting name must not exceed 255 characters.",
            );

        }


        /*
         * organization_settings is organization-scoped storage.
         *
         * Platform/module/user settings require a different persistence
         * contract and must not silently be written into this table as
         * organization settings.
         */
        if (
            setting.scope !==
            "Organization"
        ) {

            throw new Error(
                "Only Organization-scoped settings can be persisted by the admin settings repository.",
            );

        }


        if (
            !setting.valueType
        ) {

            throw new Error(
                "Setting value type is required.",
            );

        }


        if (
            !this.isSupportedValueType(
                setting.valueType,
            )
        ) {

            throw new Error(
                "Invalid setting value type.",
            );

        }


        return {

            ...setting,

            category,

            key,

            name,

            scope:
                "Organization",

        };

    }



    private isSupportedValueType(
        valueType: SettingValueType,
    ):
        boolean {

        return (

            valueType ===
                "String" ||

            valueType ===
                "Number" ||

            valueType ===
                "Boolean" ||

            valueType ===
                "Json" ||

            valueType ===
                "Array"

        );

    }



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



    private requireKey(
        key: string,
    ):
        string {

        const normalized =
            this.normalizeKey(
                key,
            );


        if (
            !normalized
        ) {

            throw new Error(
                "Setting key is required.",
            );

        }


        if (
            normalized.length >
            SettingsRepository.maxKeyLength
        ) {

            throw new Error(
                "Setting key must not exceed 255 characters.",
            );

        }


        if (
            !SettingsRepository.keyPattern.test(
                normalized,
            )
        ) {

            throw new Error(
                "Setting key may contain only letters, numbers, dots, underscores, colons, and hyphens.",
            );

        }


        return normalized;

    }



    private normalizeKey(
        key: string,
    ):
        string {

        return typeof key === "string"
            ? key
                .trim()
                .toLowerCase()
            : "";

    }



    /* ========================================================================
     * DATABASE → DOMAIN MAPPING
     * ====================================================================== */


    private mapRow(
        row: OrganizationSettingRow,
    ):
        PlatformSetting {

        const category =
            this.mapCategory(
                row.category,
            );


        const value =
            this.normalizeValue(
                row.setting_value,
            );


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

            value,

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
     * organization_settings.category is currently represented as a string
     * persistence value. Unknown legacy values are contained at this boundary.
     */
    private mapCategory(
        category: string | null,
    ):
        SettingCategory {

        if (
            !category
        ) {

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
     * Normalize the persisted value into the application's supported value
     * contract without fabricating unsupported database semantics.
     */
    private normalizeValue(
        value: unknown,
    ):
        PlatformSetting["value"] {

        if (
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean"
        ) {

            return value;

        }


        if (
            Array.isArray(value)
        ) {

            return value;

        }


        if (
            value !== null &&
            typeof value === "object"
        ) {

            return value as Record<
                string,
                unknown
            >;

        }


        /*
         * The current PlatformSetting contract does not include null.
         *
         * A null database value is therefore represented as an empty object
         * rather than leaking an incompatible runtime value through the
         * Admin domain contract.
         */
        return {};

    }



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



    /* ========================================================================
     * PERSISTENCE ERROR NORMALIZATION
     * ====================================================================== */


    private translatePersistenceError(
        error: {
            code?: string;
            message?: string;
        },
    ):
        Error {

        if (
            error.code ===
            "23505"
        ) {

            return new Error(
                "A setting with this key already exists.",
            );

        }


        return new Error(
            error.message ||
            "Unable to persist setting.",
        );

    }



    /* ========================================================================
     * RESPONSE NORMALIZATION
     * ====================================================================== */


    private toRows(
        data: unknown,
    ):
        OrganizationSettingRow[] {

        if (
            !Array.isArray(data)
        ) {

            return [];

        }


        return data.filter(
            (
                row,
            ): row is OrganizationSettingRow =>
                this.isOrganizationSettingRow(
                    row,
                ),
        );

    }



    private isOrganizationSettingRow(
        value: unknown,
    ):
        value is OrganizationSettingRow {

        if (
            typeof value !==
            "object" ||
            value === null
        ) {

            return false;

        }


        const row =
            value as Record<
                string,
                unknown
            >;


        return (

            typeof row.id ===
                "string" &&

            typeof row.organization_id ===
                "string" &&

            typeof row.setting_key ===
                "string" &&

            (
                row.category ===
                    null ||
                typeof row.category ===
                    "string"
            ) &&

            (
                row.description ===
                    null ||
                typeof row.description ===
                    "string"
            ) &&

            (
                row.created_at ===
                    null ||
                typeof row.created_at ===
                    "string"
            ) &&

            (
                row.updated_at ===
                    null ||
                typeof row.updated_at ===
                    "string"
            )

        );

    }



    private toIdRows(
        data: unknown,
    ):
        Array<{
            id: string;
        }> {

        if (
            !Array.isArray(data)
        ) {

            return [];

        }


        return data.filter(
            (
                row,
            ): row is {
                id: string;
            } =>

                typeof row ===
                    "object" &&

                row !== null &&

                "id" in row &&

                typeof (
                    row as {
                        id?: unknown;
                    }
                ).id === "string",

        );

    }

}
