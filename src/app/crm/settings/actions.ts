'use server';

import {
    createSupabaseServerClient,
} from '@/lib/supabase/server-client';

import {
    SettingsRepository,
} from '@/repositories/crm/SettingsRepository';

import {
    PermissionServiceInstance,
} from '@/services/crm/PermissionService';

import {
    CRM_ADMIN_ROLE,
} from '@/services/crm/crmPermissions';

import type {
    Setting,
    SettingStatus,
} from '@/types/crm/Settings';


async function repository() {

    const supabase =
        await createSupabaseServerClient();

    return new SettingsRepository(
        supabase,
    );

}


function validateId(
    id: string,
) {

    if (!id || id.trim().length === 0) {

        throw new Error(
            'Invalid setting id.',
        );

    }

}



function validateData(
    data: Partial<Setting>,
    isCreate = false,
) {

    const name =
        data.name?.trim();

    const key =
        data.key?.trim();



    if (isCreate && !key) {

        throw new Error(
            'Setting key is required.',
        );

    }



    if (
        data.name !== undefined &&
        !name
    ) {

        throw new Error(
            'Setting name is required.',
        );

    }



    if (
        data.key !== undefined &&
        !key
    ) {

        throw new Error(
            'Setting key is required.',
        );

    }



    if (
        key &&
        !/^[a-zA-Z0-9._-]+$/.test(
            key,
        )
    ) {

        throw new Error(
            'Setting key may contain only letters, numbers, dots, underscores and hyphens.',
        );

    }



    if (
        key &&
        key.length > 150
    ) {

        throw new Error(
            'Setting key cannot exceed 150 characters.',
        );

    }



    if (
        name &&
        name.length > 150
    ) {

        throw new Error(
            'Setting name cannot exceed 150 characters.',
        );

    }

}



function can(
    action:
        | 'create'
        | 'update'
        | 'delete',
) {

    return PermissionServiceInstance.hasPermission(
        CRM_ADMIN_ROLE,
        'Settings',
        action,
    );

}



function normalizeData(
    data: Partial<Setting>,
): Partial<Setting> {

    return {

        ...data,

        name:
            data.name?.trim(),

        key:
            data.key?.trim(),

    };

}



function translateError(
    error: unknown,
): Error {

    const message =
        error instanceof Error
            ? error.message
            : String(error);



    if (
        message.includes('duplicate')
        ||
        message.includes('unique')
    ) {

        return new Error(
            'A setting with this key already exists.',
        );

    }



    return error instanceof Error
        ? error
        : new Error(
            'Unable to process setting request.',
        );

}



export async function getSettings() {

    const repo =
        await repository();

    return repo.list();

}



async function getArchivedSettings() {

    const repo =
        await repository();

    return repo.listArchived();

}



export async function getSetting(
    id: string,
) {

    validateId(id);

    const repo =
        await repository();

    return repo.details(
        id,
    );

}



export async function createSetting(
    data: Partial<Setting>,
) {

    if (!can('create')) {

        throw new Error(
            'Permission denied.',
        );

    }



    try {

        validateData(
            data,
            true,
        );


        const repo =
            await repository();


        return await repo.create(
            normalizeData(data),
        );


    } catch (error) {

        throw translateError(
            error,
        );

    }

}



export async function updateSetting(
    id: string,
    data: Partial<Setting>,
) {

    if (!can('update')) {

        throw new Error(
            'Permission denied.',
        );

    }



    try {

        validateId(
            id,
        );


        validateData(
            data,
        );


        const repo =
            await repository();


        return await repo.update(
            id,
            normalizeData(data),
        );


    } catch (error) {

        throw translateError(
            error,
        );

    }

}



async function deleteSetting(
    id: string,
) {

    if (!can('delete')) {

        throw new Error(
            'Permission denied.',
        );

    }


    validateId(
        id,
    );


    const repo =
        await repository();


    return repo.delete(
        id,
    );

}



async function restoreSetting(
    id: string,
) {

    if (!can('update')) {

        throw new Error(
            'Permission denied.',
        );

    }


    validateId(
        id,
    );


    const repo =
        await repository();


    return repo.restore(
        id,
    );

}



async function updateSettingStatus(
    id: string,
    status: SettingStatus,
) {

    if (!can('update')) {

        throw new Error(
            'Permission denied.',
        );

    }


    validateId(
        id,
    );


    const repo =
        await repository();


    return repo.updateStatus(
        id,
        status,
    );

}



export async function getSettingsSummary() {

    const repo =
        await repository();

    return repo.summary();

}