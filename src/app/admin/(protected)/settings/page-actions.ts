"use server";


import type {

    PlatformSetting,

    SettingCategory,

    SettingGroup,

} from "@/types/admin/Settings";


import {

    createSupabaseServerClient,

} from "@/lib/supabase/server-client";


import {

    SettingsRepository,

} from "@/repositories/admin/SettingsRepository";





/**
 * ============================================================================
 * ADS Admin Settings Server Actions
 *
 * Organization-scoped platform settings application boundary.
 *
 * Responsibilities:
 * - Create an authenticated Supabase server client per request.
 * - Delegate tenant isolation to SettingsRepository / BaseRepository.
 * - Validate caller-provided setting contracts.
 * - Never accept organization_id from the client.
 * - Never expose raw database rows.
 * - Provide the persistence boundary consumed by the Settings UI.
 * ============================================================================
 */


async function repository():

Promise<SettingsRepository> {


    const supabase =

        await createSupabaseServerClient();


    return new SettingsRepository(

        supabase,

    );

}





/**
 * Return all organization-scoped platform settings.
 */
export async function getSettings():

Promise<PlatformSetting[]> {


    const repo =

        await repository();


    return repo.list();

}





/**
 * Return all settings belonging to a category.
 */
export async function getSettingsByCategory(

    category: SettingCategory,

): Promise<SettingGroup> {


    const normalizedCategory =

        validateCategory(

            category,

        );


    const repo =

        await repository();


    return repo.findByCategory(

        normalizedCategory,

    );

}





/**
 * Find one setting by its organization-scoped key.
 */
export async function getSettingByKey(

    key: string,

): Promise<PlatformSetting | null> {


    const normalizedKey =

        validateKey(

            key,

        );


    const repo =

        await repository();


    return repo.findByKey(

        normalizedKey,

    );

}





/**
 * Create or update an organization-scoped platform setting.
 *
 * The repository owns the persistence semantics and tenant scope.
 * organizationId supplied by a client is deliberately ignored.
 */
export async function saveSetting(

    setting: PlatformSetting,

): Promise<void> {


    const normalizedSetting =

        validateSetting(

            setting,

        );


    const repo =

        await repository();


    await repo.save(

        normalizedSetting,

    );

}





function validateSetting(

    setting: PlatformSetting,

): PlatformSetting {


    if (!setting) {

        throw new Error(

            "Setting is required.",

        );

    }


    const category =

        validateCategory(

            setting.category,

        );


    const key =

        validateKey(

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


    return {

        ...setting,

        category,

        key,

        name,

    };

}





function validateCategory(

    category: SettingCategory,

): SettingCategory {


    if (

        !category ||

        !String(category).trim()

    ) {

        throw new Error(

            "Setting category is required.",

        );

    }


    return category;

}





function validateKey(

    key: string,

): string {


    const normalizedKey =

        typeof key === "string"

            ? key.trim()

            : "";


    if (!normalizedKey) {

        throw new Error(

            "Setting key is required.",

        );

    }


    if (

        !/^[a-zA-Z0-9._:-]+$/.test(

            normalizedKey,

        )

    ) {

        throw new Error(

            "Setting key may contain only letters, numbers, dots, underscores, colons, and hyphens.",

        );

    }


    return normalizedKey;

}