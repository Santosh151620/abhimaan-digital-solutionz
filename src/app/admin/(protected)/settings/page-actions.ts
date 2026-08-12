"use server";


import type {

    PlatformSetting,

    SettingGroup,

} from "@/types/admin/Settings";



import {

    createSupabaseServerClient,

} from "@/lib/supabase/server-client";



import {

    SettingsRepository,

} from "@/repositories/admin/SettingsRepository";







async function repository(){



    const supabase =

        await createSupabaseServerClient();



    return new SettingsRepository(

        supabase,

    );

}







export async function getSettings():Promise<PlatformSetting[]> {



    const repo = await repository();



    return await repo.findAll();



}







async function getSettingsByCategory(

    category:string,

):Promise<SettingGroup>{



    const repo = await repository();

return await repo.findByCategory(
    category as PlatformSetting["category"],
);



}







async function getSettingByKey(

    key:string,

):Promise<PlatformSetting | null>{



    const repo = await repository();



    return await repo.findByKey(

        key,

    );
}