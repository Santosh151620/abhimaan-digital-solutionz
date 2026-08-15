import type {
    SupabaseClient,
} from '@supabase/supabase-js';


import {
    BaseRepository,
} from '@/lib/db/base-repository';


import type {
    OrganizationSettingRow,
    Setting,
    SettingCategory,
    SettingStatus,
    SettingSummary,
    SettingValue,
} from '@/types/crm/Settings';



/**
 * ============================================================================
 * ADS CRM — SETTINGS REPOSITORY
 * ============================================================================
 *
 * Persistence boundary for the existing organization_settings table.
 *
 * IMPORTANT:
 *
 * - Do not add domain-only Setting fields to the database payload.
 * - Do not rename organization_settings columns.
 * - Tenant isolation is enforced through organization_id and BaseRepository.
 * - RLS remains the database-level security boundary.
 * - Legacy service methods are retained for compatibility.
 * ============================================================================
 */


const SETTING_COLUMNS = [
    'id',
    'organization_id',
    'setting_key',
    'setting_value',
    'category',
    'description',
    'metadata',
    'created_at',
    'updated_at',
].join(',');



const SETTING_CATEGORIES:
    readonly SettingCategory[] =
    [

        'General',

        'System',

        'Company',

        'User',

        'Notification',

        'Notifications',

        'Integration',

        'Integrations',

        'Security',

        'Appearance',

        'Other',

        'CRM',

        'Sales',

        'Workflow',

        'Email',

        'Localization',

        'Authentication',

        'Branding',

        'Storage',

        'AI',

        'Reporting',

        'Billing',

    ];



export class SettingsRepository
    extends BaseRepository<Setting> {


    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            'organization_settings',
        );

    }



    /**
     * Normalize and validate a setting key.
     */
    private normalizeKey(
        key?: string,
    ): string {

        const normalized =
            typeof key === 'string'
                ? key
                    .trim()
                    .toLowerCase()
                : '';


        if (!normalized) {

            throw new Error(
                'Setting key is required.',
            );

        }


        if (
            normalized.length > 255
        ) {

            throw new Error(
                'Setting key must not exceed 255 characters.',
            );

        }


        if (
            !/^[a-z0-9._:-]+$/.test(
                normalized,
            )
        ) {

            throw new Error(
                'Setting key may contain only letters, numbers, dots, underscores, colons, and hyphens.',
            );

        }


        return normalized;

    }



    /**
     * Normalize and validate a setting category.
     */
    private normalizeCategory(
        category?: SettingCategory | string,
    ): SettingCategory {

        const normalized =
            typeof category === 'string'
                ? category.trim()
                : '';


        if (!normalized) {

            return 'General';

        }


        if (
            SETTING_CATEGORIES.includes(
                normalized as SettingCategory,
            )
        ) {

            return normalized as SettingCategory;

        }


        throw new Error(
            `Unsupported setting category: ${normalized}`,
        );

    }



    /**
     * Normalize database values into the domain SettingValue contract.
     */
    private normalizeValue(
        value: unknown,
    ): SettingValue {

        if (
            value === null
        ) {

            return null;

        }


        if (
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean'
        ) {

            return value;

        }


        if (
            Array.isArray(value)
        ) {

            return value;

        }


        if (
            typeof value === 'object'
        ) {

            return value as Record<
                string,
                unknown
            >;

        }


        return String(value);

    }



    /**
     * Resolve the domain value type from the persisted value.
     */
    private resolveValueType(
        value: unknown,
    ): Setting['valueType'] {

        if (
            typeof value === 'string'
        ) {

            return 'String';

        }


        if (
            typeof value === 'number' &&
            Number.isFinite(value)
        ) {

            return 'Number';

        }


        if (
            typeof value === 'boolean'
        ) {

            return 'Boolean';

        }


        if (
            Array.isArray(value)
        ) {

            return 'Array';

        }


        return 'Json';

    }



    /**
     * Convert a database row into the canonical Setting domain model.
     *
     * Domain-only properties are represented using safe defaults because the
     * current organization_settings schema does not persist them.
     */
    private mapRow(
        row: OrganizationSettingRow,
    ): Setting {

        const value =
            this.normalizeValue(
                row.setting_value,
            );


        const category =
            this.normalizeCategory(
                row.category ??
                'General',
            );


        return {

            id:
                row.id,

            organizationId:
                row.organization_id,

            entityType:
                'PlatformSetting',

            scope:
                'Organization',

            category,

            key:
                row.setting_key,

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
                row.metadata ??
                {},

            createdAt:
                row.created_at ??
                '',

            updatedAt:
                row.updated_at ??
                '',

        };

    }



    /**
     * Ensure the setting key is unique inside the current organization.
     *
     * The database unique constraint remains the final concurrency safeguard.
     */
    private async ensureUniqueKey(
        key: string,
        ignoreId?: string,
    ): Promise<void> {

        let query =
            this.tableRef()
                .select('id')
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .eq(
                    'setting_key',
                    key,
                );


        if (
            ignoreId
        ) {

            query =
                query.neq(
                    'id',
                    ignoreId,
                );

        }


        const {
            data,
            error,
        } =
            await query.maybeSingle();


        if (
            error
        ) {

            throw error;

        }


        if (
            data
        ) {

            throw new Error(
                'A setting with this key already exists.',
            );

        }

    }



    /**
     * List settings belonging to the current organization.
     */
    async list():
        Promise<Setting[]> {

        const {
            data,
            error,
        } =
            await this
                .tableRef()
                .select(
                    SETTING_COLUMNS,
                )
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .order(
                    'category',
                    {
                        ascending: true,
                    },
                )
                .order(
                    'setting_key',
                    {
                        ascending: true,
                    },
                );


        if (
            error
        ) {

            throw error;

        }


        const rows =
            (data ?? []) as unknown as
                OrganizationSettingRow[];


        return rows.map(
            row =>
                this.mapRow(
                    row,
                ),
        );

    }



    /**
     * The current organization_settings schema has no archived state.
     *
     * Retained for compatibility with existing CRM callers.
     */
    async listArchived():
        Promise<Setting[]> {

        return [];

    }



    /**
     * Get one setting belonging to the current organization.
     */
    async details(
        id: string,
    ):
        Promise<Setting | null> {

        const normalizedId =
            id.trim();


        if (!normalizedId) {

            throw new Error(
                'Setting id is required.',
            );

        }


        const {
            data,
            error,
        } =
            await this
                .tableRef()
                .select(
                    SETTING_COLUMNS,
                )
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .eq(
                    'id',
                    normalizedId,
                )
                .maybeSingle();


        if (
            error
        ) {

            throw error;

        }


        if (
            !data
        ) {

            return null;

        }


        return this.mapRow(
            data as unknown as
                OrganizationSettingRow,
        );

    }



    /**
     * Create a setting.
     */
    async create(
        data: Partial<Setting>,
    ):
        Promise<Setting> {

        if (
            !data
        ) {

            throw new Error(
                'Setting data is required.',
            );

        }


        const key =
            this.normalizeKey(
                data.key,
            );


        const category =
            this.normalizeCategory(
                data.category,
            );


        const name =
            typeof data.name === 'string'
                ? data.name.trim()
                : key;


        if (!name) {

            throw new Error(
                'Setting name is required.',
            );

        }


        if (
            name.length > 255
        ) {

            throw new Error(
                'Setting name must not exceed 255 characters.',
            );

        }


        await this.ensureUniqueKey(
            key,
        );


        const payload = {

            organization_id:
                this.organizationId,

            setting_key:
                key,

            setting_value:
                data.value ??
                null,

            category,

            description:
                data.description?.trim() ??
                null,

            ...(data.metadata !== undefined
                ? {
                    metadata:
                        data.metadata,
                }
                : {}),

        };


        const {
            data: row,
            error,
        } =
            await this
                .tableRef()
                .insert(
                    payload,
                )
                .select(
                    SETTING_COLUMNS,
                )
                .single();


        if (
            error
        ) {

            if (
                error.code === '23505'
            ) {

                throw new Error(
                    'A setting with this key already exists.',
                );

            }


            throw error;

        }


        return this.mapRow(
            row as unknown as
                OrganizationSettingRow,
        );

    }



    /**
     * Update a setting.
     */
    async update(
        id: string,
        data: Partial<Setting>,
    ):
        Promise<Setting> {

        const normalizedId =
            id.trim();


        if (!normalizedId) {

            throw new Error(
                'Setting id is required.',
            );

        }


        const existing =
            await this.details(
                normalizedId,
            );


        if (
            !existing
        ) {

            throw new Error(
                `Setting not found: ${normalizedId}`,
            );

        }


        const key =
            data.key !== undefined
                ? this.normalizeKey(
                    data.key,
                )
                : existing.key;


        if (
            key !== existing.key
        ) {

            await this.ensureUniqueKey(
                key,
                normalizedId,
            );

        }


        const category =
            data.category !== undefined
                ? this.normalizeCategory(
                    data.category,
                )
                : existing.category;


        const payload = {

            setting_key:
                key,

            setting_value:
                data.value !== undefined
                    ? data.value
                    : existing.value,

            category,

            description:
                data.description !== undefined
                    ? data.description?.trim() ??
                        null
                    : existing.description ??
                        null,

            ...(data.metadata !== undefined
                ? {
                    metadata:
                        data.metadata,
                }
                : {}),

        };


        const {
            data: row,
            error,
        } =
            await this
                .tableRef()
                .update(
                    payload,
                )
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .eq(
                    'id',
                    normalizedId,
                )
                .select(
                    SETTING_COLUMNS,
                )
                .single();


        if (
            error
        ) {

            if (
                error.code === '23505'
            ) {

                throw new Error(
                    'A setting with this key already exists.',
                );

            }


            throw error;

        }


        return this.mapRow(
            row as unknown as
                OrganizationSettingRow,
        );

    }



    /**
     * Preserve the status API without inventing unsupported persistence.
     *
     * The current organization_settings table has no status column.
     */
    async updateStatus(
        id: string,
        status: SettingStatus,
    ):
        Promise<Setting> {

        if (
            status !== 'Active'
        ) {

            throw new Error(
                'Inactive setting status is not supported by the current organization_settings schema.',
            );

        }


        const existing =
            await this.details(
                id,
            );


        if (
            !existing
        ) {

            throw new Error(
                `Setting not found: ${id}`,
            );

        }


        return existing;

    }



    /**
     * Delete a setting from the current organization.
     */
    async delete(
        id: string,
    ):
        Promise<void> {

        const normalizedId =
            id.trim();


        if (!normalizedId) {

            throw new Error(
                'Setting id is required.',
            );

        }


        const {
            data,
            error,
        } =
            await this
                .tableRef()
                .delete()
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .eq(
                    'id',
                    normalizedId,
                )
                .select('id')
                .maybeSingle();


        if (
            error
        ) {

            throw error;

        }


        if (
            !data
        ) {

            throw new Error(
                `Setting not found: ${normalizedId}`,
            );

        }

    }



    /**
     * Restore compatibility method.
     *
     * No archived state exists in the current persistence contract.
     */
    async restore(
        id: string,
    ):
        Promise<boolean> {

        const existing =
            await this.details(
                id,
            );


        return Boolean(
            existing,
        );

    }



    /**
     * Return the canonical SettingsSummary.
     *
     * Some domain fields cannot currently be persisted because the existing
     * organization_settings schema does not contain corresponding columns.
     *
     * Therefore:
     *
     * - active = all current rows
     * - inactive = 0
     * - editable = all current rows
     * - system = 0
     * - encrypted = 0
     * - categories = distinct normalized categories
     */
    async summary():
        Promise<SettingSummary> {

        const settings =
            await this.list();


        const categories =
            new Set(
                settings.map(
                    setting =>
                        setting.category,
                ),
            );


        return {

            total:
                settings.length,

            active:
                settings.filter(
                    setting =>
                        setting.isActive,
                ).length,

            inactive:
                settings.filter(
                    setting =>
                        !setting.isActive,
                ).length,

            editable:
                settings.filter(
                    setting =>
                        !setting.isReadonly,
                ).length,

            system:
                settings.filter(
                    setting =>
                        setting.isSystem,
                ).length,

            encrypted:
                settings.filter(
                    setting =>
                        setting.isEncrypted,
                ).length,

            categories:
                categories.size,

        };

    }

}
