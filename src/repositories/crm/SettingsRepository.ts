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
} from '@/types/crm/Settings';


interface OrganizationSettingRow {

    id: string;

    organization_id: string;

    setting_key: string;

    setting_value: unknown;

    category: string | null;

    description: string | null;

    created_at: string;

    updated_at: string;

    metadata: Record<string, unknown> | null;

}


interface SettingMetadata {

    settingNumber?: string;

    companyId?: string;

    name?: string;

    defaultValue?: string;

    status?: SettingStatus;

    editable?: boolean;

    encrypted?: boolean;

    archived?: boolean;

}



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
    ) {

        return (
            key
                ?.trim()
                .toLowerCase() ?? ''
        );

    }



    private normalizeValue(
        value: unknown,
    ): string {

        if (
            typeof value === 'string'
        ) {

            return value;

        }


        if (
            value === null ||
            value === undefined
        ) {

            return '';

        }


        return JSON.stringify(value);

    }



    private mapRow(
        row: OrganizationSettingRow,
    ): Setting {


        const metadata =
            (row.metadata ?? {}) as SettingMetadata;



        return {

            id:
                row.id,


            settingNumber:
                metadata.settingNumber ??
                `SET-${row.id.slice(0, 8)}`,


            companyId:
                metadata.companyId,


            category:
                (
                    row.category ??
                    'General'
                ) as SettingCategory,


            key:
                row.setting_key,


            name:
                metadata.name ??
                row.setting_key,


            description:
                row.description ??
                undefined,


            value:
                this.normalizeValue(
                    row.setting_value,
                ),


            defaultValue:
                metadata.defaultValue,


            status:
                metadata.status ??
                'Active',


            editable:
                metadata.editable ??
                true,


            encrypted:
                metadata.encrypted ??
                false,


            archived:
                metadata.archived ??
                false,


            createdAt:
                row.created_at,


            updatedAt:
                row.updated_at,

        };

    }



    private async ensureUniqueKey(
        key:string,
        ignoreId?:string,
    ) {


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


        if (ignoreId) {

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



        if (error) {

            throw error;

        }



        if (data) {

            throw new Error(
                'A setting with this key already exists.',
            );

        }

    }



    async list(): Promise<Setting[]> {


        const {
            data,
            error,
        } =
            await this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .order(
                    'created_at',
                    {
                        ascending:false,
                    },
                );



        if (error) {

            throw error;

        }



        return (
            (data ?? []) as OrganizationSettingRow[]
        )
            .map(
                row =>
                    this.mapRow(row),
            )
            .filter(
                setting =>
                    !setting.archived,
            );

    }



    async listArchived(): Promise<Setting[]> {


        const {
            data,
            error,
        } =
            await this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .order(
                    'updated_at',
                    {
                        ascending:false,
                    },
                );



        if (error) {

            throw error;

        }



        return (
            (data ?? []) as OrganizationSettingRow[]
        )
            .map(
                row =>
                    this.mapRow(row),
            )
            .filter(
                setting =>
                    setting.archived,
            );

    }



    async details(
        id:string,
    ):Promise<Setting | null> {


        const {
            data,
            error,
        }
        =
            await this.tableRef()
                .select('*')
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .eq(
                    'id',
                    id,
                )
                .maybeSingle();



        if (error) {

            throw error;

        }



        if (!data) {

            return null;

        }



        return this.mapRow(
            data as OrganizationSettingRow,
        );

    }
        async create(
        data:Partial<Setting>,
    ):Promise<Setting> {


        const key =
            this.normalizeKey(
                data.key,
            );


        await this.ensureUniqueKey(
            key,
        );



        const metadata:SettingMetadata = {


            settingNumber:
                data.settingNumber ??
                `SET-${Date.now()}`,


            companyId:
                data.companyId,


            name:
                data.name ??
                key,


            defaultValue:
                data.defaultValue,


            status:
                data.status ??
                'Active',


            editable:
                data.editable ??
                true,


            encrypted:
                data.encrypted ??
                false,


            archived:
                false,

        };



        const payload = {


            setting_key:
                key,


            setting_value:
                data.value ??
                '',


            category:
                data.category ??
                'General',


            description:
                data.description ??
                null,


            metadata,

        };



        const {
            data: row,
            error,
        } =
            await this.tableRef()
                .insert(
                    this.withCreateTenant(
                        payload,
                    ),
                )
                .select('*')
                .single();



        if (error) {

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
            row as OrganizationSettingRow,
        );

    }





    async update(
        id:string,
        data:Partial<Setting>,
    ):Promise<Setting> {


        const existing =
            await this.details(id);



        if (!existing) {

            throw new Error(
                `Setting not found: ${id}`,
            );

        }



        const key =
            data.key !== undefined
                ? this.normalizeKey(data.key)
                : existing.key;



        if (
            key !== existing.key
        ) {

            await this.ensureUniqueKey(
                key,
                id,
            );

        }



        const metadata:SettingMetadata = {


            settingNumber:
                data.settingNumber ??
                existing.settingNumber,


            companyId:
                data.companyId ??
                existing.companyId,


            name:
                data.name ??
                existing.name,


            defaultValue:
                data.defaultValue ??
                existing.defaultValue,


            status:
                data.status ??
                existing.status,


            editable:
                data.editable ??
                existing.editable,


            encrypted:
                data.encrypted ??
                existing.encrypted,


            archived:
                data.archived ??
                existing.archived,

        };



        const payload = {


            setting_key:
                key,


            setting_value:
                data.value ??
                existing.value,


            category:
                data.category ??
                existing.category,


            description:
                data.description !== undefined
                    ? data.description
                    : existing.description ?? null,


            metadata,

        };



        const {
            data: row,
            error,
        }
        =
            await this.tableRef()
                .update(
                    payload,
                )
                .eq(
                    'organization_id',
                    this.organizationId,
                )
                .eq(
                    'id',
                    id,
                )
                .select('*')
                .single();



        if (error) {

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
            row as OrganizationSettingRow,
        );

    }





    async updateStatus(
        id:string,
        status:SettingStatus,
    ):Promise<Setting> {


        return this.update(
            id,
            {
                status,
            },
        );

    }





    async delete(
        id:string,
    ):Promise<void> {


        await this.update(
            id,
            {
                archived:true,
            },
        );

    }





    async restore(
        id:string,
    ):Promise<boolean> {


        const existing =
            await this.details(id);



        if (!existing) {

            return false;

        }



        await this.update(
            id,
            {
                archived:false,
            },
        );



        return true;

    }





    async summary() {


        const settings =
            await this.list();



        return {


            total:
                settings.length,


            active:
                settings.filter(
                    setting =>
                        setting.status === 'Active',
                ).length,


            inactive:
                settings.filter(
                    setting =>
                        setting.status === 'Inactive',
                ).length,


            editable:
                settings.filter(
                    setting =>
                        setting.editable,
                ).length,


            encrypted:
                settings.filter(
                    setting =>
                        setting.encrypted,
                ).length,

        };

    }


}