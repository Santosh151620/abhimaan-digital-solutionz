/**
 * ============================================================================
 * Settings Repository
 *
 * Admin Organization Settings
 *
 * Database:
 * admin.organization_settings
 *
 * Architecture:
 *
 * SettingsService
 *        ↓
 * SettingsRepository
 *        ↓
 * BaseRepository
 *        ↓
 * admin.organization_settings
 *
 * ============================================================================
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { BaseRepository } from "@/lib/db/base-repository";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

import type {
    PlatformSetting,
} from "@/types/admin/Settings";


export interface ISettingsRepository {

    list(): Promise<PlatformSetting[]>;

    find(
        category: string,
        key: string
    ): Promise<PlatformSetting | null>;


    save(
        setting: PlatformSetting
    ): Promise<void>;

}


type OrganizationSettingRow = {

    id: string;

    organization_id: string;

    setting_category: string;

    settings: Record<string, unknown>;

};



export class SettingsRepository
    extends BaseRepository<PlatformSetting>
    implements ISettingsRepository {


    constructor(
        supabase: SupabaseClient
    ) {

        super(
            supabase,
            "organization_settings"
        );

    }


    static async create() {

        const supabase =
            await createSupabaseServerClient();


        return new SettingsRepository(
            supabase
        );

    }

async list(): Promise<PlatformSetting[]> {

    const { data, error } =
        await this.tableRef()
            .select("*");

    if (error) {
        throw error;
    }

    const rows =
        (data ?? []) as OrganizationSettingRow[];

    return rows.flatMap((row) =>
        Object.entries(row.settings ?? {}).map(
            ([key, value]): PlatformSetting => ({

                id: row.id,

                organizationId: row.organization_id,

                entityType: "PlatformSetting",

                createdAt: "",

                updatedAt: "",

                scope: "Organization",

                category:
                    row.setting_category as PlatformSetting["category"],

                key,

                name: key,

                description: undefined,

                value:
                    value as PlatformSetting["value"],

                valueType: "Json",

                isSystem: false,

                isReadonly: false,

                isEncrypted: false,

                isVisible: true,

                isActive: true,

                metadata: {},

            })
        )
    );

}
    async find(
        category: string,
        key: string
    ): Promise<PlatformSetting | null> {


        const { data, error } =
            await this.tableRef()
                .select("*")
                .eq(
                    "setting_category",
                    category
                )
                .maybeSingle();



        if (error) {

            throw error;

        }


        if (!data) {

            return null;

        }



        const row =
            data as OrganizationSettingRow;



        if (
            !(key in row.settings)
        ) {

            return null;

        }

return {
    id: row.id,
    organizationId: row.organization_id,
    entityType: "PlatformSetting",
    createdAt: "",
    updatedAt: "",
    scope: "Organization",
    category: row.setting_category as PlatformSetting["category"],
    key,
    name: key,
    description: undefined,
    value:
    row.settings[key] as PlatformSetting["value"],
    valueType: "Json",
    isSystem: false,
    isReadonly: false,
    isEncrypted: false,
    isVisible: true,
    isActive: true,
    metadata: {},
};
    }




    async save(
        setting: PlatformSetting
    ): Promise<void> {


        const existing =
            await this.find(
                setting.category,
                setting.key
            );



        if (existing) {


            const { data, error } =
                await this.tableRef()
                    .select("settings")
                    .eq(
                        "id",
                        existing.id
                    )
                    .single();



            if (error) {

                throw error;

            }



            const settings =
                {
                    ...(data.settings ?? {}),
                    [setting.key]:
                        setting.value,
                };



            const { error:updateError } =
                await this.tableRef()
                    .update({
                        settings,
                    })
                    .eq(
                        "id",
                        existing.id
                    );



            if (updateError) {

                throw updateError;

            }



            return;

        }




        const { error } =
            await this.tableRef()
                .insert({

                    setting_category:
                        setting.category,

                    settings:
                        {
                            [setting.key]:
                                setting.value,
                        },

                });



        if (error) {

            throw error;

        }


    }


}