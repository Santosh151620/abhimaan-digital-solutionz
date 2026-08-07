/**
 * ============================================================================
 * Settings Repository
 *
 * Admin Organization Settings
 *
 * Architecture:
 *
 * SettingsService
 *        ↓
 * SettingsRepository
 *        ↓
 * BaseRepository
 *        ↓
 * organization_settings
 *
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

        key:string,

    ):

        Promise<PlatformSetting | null>;

}


type OrganizationSettingRow = {

    id:string;

    organization_id:string;

    setting_category:string;

    settings:Record<string, unknown>;

    created_at?:string;

    updated_at?:string;

};







export class SettingsRepository

    extends BaseRepository<PlatformSetting>

    implements ISettingsRepository {



    constructor(
        supabase:SupabaseClient,
    ){

        super(
            supabase,
            "organization_settings",
        );

    }







    async list():
        Promise<PlatformSetting[]> {


        const {
            data,
            error,

        } =
            await this
                .tableRef()
                .select("*");



        if(error)
            throw error;




        const rows =
            (data ?? []) as OrganizationSettingRow[];




        return rows.flatMap(
            row =>

                Object.entries(
                    row.settings ?? {},
                )
                .map(
                    ([key,value]) => ({

                        id:
                            row.id,


                        organizationId:
                            row.organization_id,


                        entityType:
                            "PlatformSetting",


                        scope:
                            "Organization",


                        category:
                            row.setting_category as PlatformSetting["category"],


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


                    } as PlatformSetting),
                ),
        );


    }









    async find(
        category:string,
        key:string,
    ):
        Promise<PlatformSetting | null> {


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
                    category,
                )
                .maybeSingle();



        if(error)
            throw error;



        if(!data)
            return null;




        const row =
            data as OrganizationSettingRow;




        if(
            !(key in row.settings)
        ){

            return null;

        }





        return {

            id:
                row.id,


            organizationId:
                row.organization_id,


            entityType:
                "PlatformSetting",


            scope:
                "Organization",


            category:
                row.setting_category as PlatformSetting["category"],


            key,


            name:
                key,


            description:
                undefined,


            value:
                row.settings[key] as PlatformSetting["value"],


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

    }









    async save(
        setting:PlatformSetting,
    ):
        Promise<void> {


        const existing =
            await this.find(
                setting.category,
                setting.key,
            );




        if(existing){


            const {
                data,
                error,

            } =
                await this
                    .tableRef()
                    .select("settings")
                    .eq(
                        "id",
                        existing.id,
                    )
                    .single();



            if(error)
                throw error;



            const settings =
            {

                ...(data.settings ?? {}),

                [setting.key]:
                    setting.value,

            };




            const {
                error:updateError,

            } =
                await this
                    .tableRef()
                    .update({
                        settings,
                    })
                    .eq(
                        "id",
                        existing.id,
                    )
                    .eq(
                        "organization_id",
                        this.organizationId,
                    );



            if(updateError)
                throw updateError;



            return;

        }






        const {
            error,

        } =
            await this
                .tableRef()
                .insert({

                    organization_id:
                        this.organizationId,


                    setting_category:
                        setting.category,


                    settings:
                    {

                        [setting.key]:
                            setting.value,

                    },

                });



        if(error)
            throw error;


    }


async findByCategory(

    category: PlatformSetting["category"],

) {



    const settings =

        await this.findAll();





    return {



        category,



        settings:

            settings.filter(

                setting =>

                    setting.category === category

            ),



    };

}



    async findByKey(
        key:string,
    ) {


        const settings =
            await this.list();



        return (
            settings.find(
                item =>
                    item.key === key,
            )
            ??
            null
        );


    }



}