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


type SettingAction =
    | 'create'
    | 'update'
    | 'delete';


const SETTING_KEY_PATTERN =
    /^[a-zA-Z0-9._:-]+$/;


const SETTING_KEY_MAX_LENGTH =
    255;


const SETTING_NAME_MAX_LENGTH =
    150;


const VALID_STATUSES:
    readonly SettingStatus[] =
    [
        'Active',
        'Inactive',
    ];



async function repository():
    Promise<SettingsRepository> {

    const supabase =
        await createSupabaseServerClient();

    return new SettingsRepository(
        supabase,
    );

}



function validateId(
    id: string,
): string {

    if (
        typeof id !== 'string'
    ) {

        throw new Error(
            'Invalid setting id.',
        );

    }


    const normalized =
        id.trim();


    if (!normalized) {

        throw new Error(
            'Invalid setting id.',
        );

    }


    return normalized;

}



function validateData(
    data: Partial<Setting>,
    isCreate = false,
): void {

    if (!data) {

        throw new Error(
            'Setting data is required.',
        );

    }


    const name =
        typeof data.name === 'string'
            ? data.name.trim()
            : undefined;


    const key =
        typeof data.key === 'string'
            ? data.key.trim().toLowerCase()
            : undefined;



    if (
        isCreate &&
        !key
    ) {

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
        !SETTING_KEY_PATTERN.test(
            key,
        )
    ) {

        throw new Error(
            'Setting key may contain only letters, numbers, dots, underscores, colons, and hyphens.',
        );

    }



    if (
        key &&
        key.length >
            SETTING_KEY_MAX_LENGTH
    ) {

        throw new Error(
            `Setting key cannot exceed ${SETTING_KEY_MAX_LENGTH} characters.`,
        );

    }



    if (
        name &&
        name.length >
            SETTING_NAME_MAX_LENGTH
    ) {

        throw new Error(
            `Setting name cannot exceed ${SETTING_NAME_MAX_LENGTH} characters.`,
        );

    }



    if (
        data.status !== undefined &&
        !VALID_STATUSES.includes(
            data.status,
        )
    ) {

        throw new Error(
            'Invalid setting status.',
        );

    }

}



function normalizeData(
    data: Partial<Setting>,
):
    Partial<Setting> {

    return {

        ...data,

        ...(data.name !== undefined
            ? {
                name:
                    data.name.trim(),
            }
            : {}),

        ...(data.key !== undefined
            ? {
                key:
                    data.key
                        .trim()
                        .toLowerCase(),
            }
            : {}),

    };

}



function can(
    action: SettingAction,
): boolean {

    return PermissionServiceInstance.hasPermission(
        CRM_ADMIN_ROLE,
        'Settings',
        action,
    );

}



function requirePermission(
    action: SettingAction,
): void {

    if (
        !can(action)
    ) {

        throw new Error(
            'Permission denied.',
        );

    }

}



function translateError(
    error: unknown,
): Error {

    if (
        error instanceof Error
    ) {

        const message =
            error.message;


        const normalized =
            message.toLowerCase();


        if (
            normalized.includes(
                'duplicate',
            ) ||
            normalized.includes(
                'unique',
            ) ||
            normalized.includes(
                'already exists',
            ) ||
            normalized.includes(
                '23505',
            )
        ) {

            return new Error(
                'A setting with this key already exists.',
            );

        }


        return error;

    }


    return new Error(
        'Unable to process setting request.',
    );

}



export async function getSettings():
    Promise<Setting[]> {

    const repo =
        await repository();

    return repo.list();

}



export async function getArchivedSettings():
    Promise<Setting[]> {

    const repo =
        await repository();

    return repo.listArchived();

}



export async function getSetting(
    id: string,
):
    Promise<Setting | null> {

    const normalizedId =
        validateId(
            id,
        );


    const repo =
        await repository();

    return repo.details(
        normalizedId,
    );

}



export async function createSetting(
    data: Partial<Setting>,
):
    Promise<Setting> {

    requirePermission(
        'create',
    );


    try {

        validateData(
            data,
            true,
        );


        const repo =
            await repository();


        return await repo.create(
            normalizeData(
                data,
            ),
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
):
    Promise<Setting> {

    requirePermission(
        'update',
    );


    try {

        const normalizedId =
            validateId(
                id,
            );


        validateData(
            data,
        );


        const repo =
            await repository();


        return await repo.update(
            normalizedId,
            normalizeData(
                data,
            ),
        );

    } catch (error) {

        throw translateError(
            error,
        );

    }

}



export async function deleteSetting(
    id: string,
):
    Promise<void> {

    requirePermission(
        'delete',
    );


    try {

        const normalizedId =
            validateId(
                id,
            );


        const repo =
            await repository();


        await repo.delete(
            normalizedId,
        );

    } catch (error) {

        throw translateError(
            error,
        );

    }

}



export async function restoreSetting(
    id: string,
):
    Promise<boolean> {

    requirePermission(
        'update',
    );


    try {

        const normalizedId =
            validateId(
                id,
            );


        const repo =
            await repository();


        return await repo.restore(
            normalizedId,
        );

    } catch (error) {

        throw translateError(
            error,
        );

    }

}



export async function updateSettingStatus(
    id: string,
    status: SettingStatus,
):
    Promise<Setting> {

    requirePermission(
        'update',
    );


    try {

        const normalizedId =
            validateId(
                id,
            );


        if (
            !VALID_STATUSES.includes(
                status,
            )
        ) {

            throw new Error(
                'Invalid setting status.',
            );

        }


        const repo =
            await repository();


        return await repo.updateStatus(
            normalizedId,
            status,
        );

    } catch (error) {

        throw translateError(
            error,
        );

    }

}



export async function getSettingsSummary():
    Promise<{
        total: number;
        active: number;
        inactive: number;
        editable: number;
        encrypted: number;
    }> {

    const repo =
        await repository();

    return repo.summary();

}