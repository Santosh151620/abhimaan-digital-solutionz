import type {
    SupabaseClient,
} from '@supabase/supabase-js';


import {
    BaseRepository,
} from '@/lib/db/base-repository';


import type {
    Setting,
    SettingCategory,
    SettingStatus,
    SettingValue,
} from '@/types/crm/Settings';




interface OrganizationSettingRow {

    id: string;

    organization_id: string;

    setting_key: string;

    setting_value: unknown;

    category: string | null;

    description: string | null;

    created_at: string | null;

    updated_at: string | null;

}




const SETTING_CATEGORIES:
    readonly SettingCategory[] =
    [

        'General',

        'Security',

        'Authentication',

        'Branding',

        'Localization',

        'Notification',

        'Email',

        'Storage',

        'AI',

        'Integration',

        'Workflow',

        'CRM',

        'Reporting',

        'Billing',

        'System',

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




    private mapRow(
        row: OrganizationSettingRow,
    ): Setting {

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
                'PlatformSetting',


            scope:
                'Organization',


            category:
                this.normalizeCategory(
                    row.category ??
                    'General',
                ),


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
                {},


            createdAt:
                row.created_at ??
                '',


            updatedAt:
                row.updated_at ??
                '',

        };

    }




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




    async list():
        Promise<Setting[]> {

        const {
            data,
            error,
        } =
            await this
                .tableRef()
                .select(
                    [
                        'id',
                        'organization_id',
                        'setting_key',
                        'setting_value',
                        'category',
                        'description',
                        'created_at',
                        'updated_at',
                    ].join(','),
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
                this.mapRow(row),
        );

    }




    async listArchived():
        Promise<Setting[]> {

        /*
         * The current organization_settings schema does not
         * expose an archived column.
         *
         * Keep this method for compatibility with existing
         * CRM callers, but there are no separately archived
         * records in this storage contract.
         */
        return [];

    }




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
                    [
                        'id',
                        'organization_id',
                        'setting_key',
                        'setting_value',
                        'category',
                        'description',
                        'created_at',
                        'updated_at',
                    ].join(','),
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
                    [
                        'id',
                        'organization_id',
                        'setting_key',
                        'setting_value',
                        'category',
                        'description',
                        'created_at',
                        'updated_at',
                    ].join(','),
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
                    [
                        'id',
                        'organization_id',
                        'setting_key',
                        'setting_value',
                        'category',
                        'description',
                        'created_at',
                        'updated_at',
                    ].join(','),
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




    async updateStatus(
        id: string,
        status: SettingStatus,
    ):
        Promise<Setting> {

        /*
         * The current database contract has no status
         * column. Active/inactive is therefore represented
         * by the existence of the organization setting.
         *
         * Preserve the service API without inventing a
         * database field.
         */
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




    async restore(
        id: string,
    ):
        Promise<boolean> {

        /*
         * No archived state exists in the current
         * organization_settings contract.
         */
        const existing =
            await this.details(
                id,
            );


        return Boolean(
            existing,
        );

    }




    async summary(): Promise<{
        total: number;
        active: number;
        inactive: number;
        editable: number;
        encrypted: number;
    }> {

        const settings =
            await this.list();


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

            encrypted:
                settings.filter(
                    setting =>
                        setting.isEncrypted,
                ).length,

        };

    }

}