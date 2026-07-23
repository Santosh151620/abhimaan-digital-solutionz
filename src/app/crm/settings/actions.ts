'use server';

import {
    SettingsServiceInstance,
} from '@/services/crm/SettingsService';

import {
    PermissionServiceInstance,
} from '@/services/crm/PermissionService';

import {
    CRM_ADMIN_ROLE,
} from '@/shared/crmPermissions';

import type {
    Setting,
    SettingStatus,
} from '@/types/crm/Settings';

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

export async function getSettings() {

    return SettingsServiceInstance.list();

}

export async function getArchivedSettings() {

    return SettingsServiceInstance.listArchived();

}

export async function getSetting(
    id: string,
) {

    return SettingsServiceInstance.details(
        id,
    );

}

export async function createSetting(
    data: Partial<Setting>,
) {

    if (!can('create')) {

        throw new Error(
            'Permission denied',
        );

    }

    return SettingsServiceInstance.create(
        data,
    );

}

export async function updateSetting(
    id: string,
    data: Partial<Setting>,
) {

    if (!can('update')) {

        throw new Error(
            'Permission denied',
        );

    }

    return SettingsServiceInstance.update(
        id,
        data,
    );

}

export async function deleteSetting(
    id: string,
) {

    if (!can('delete')) {

        throw new Error(
            'Permission denied',
        );

    }

    return SettingsServiceInstance.delete(
        id,
    );

}

export async function restoreSetting(
    id: string,
) {

    if (!can('update')) {

        throw new Error(
            'Permission denied',
        );

    }

    return SettingsServiceInstance.restore(
        id,
    );

}

export async function updateSettingStatus(
    id: string,
    status: SettingStatus,
) {

    if (!can('update')) {

        throw new Error(
            'Permission denied',
        );

    }

    return SettingsServiceInstance.updateStatus(
        id,
        status,
    );

}

export async function getSettingsSummary() {

    return SettingsServiceInstance.summary();

}