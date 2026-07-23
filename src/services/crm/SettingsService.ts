import {
    SettingsRepositoryInstance,
} from '@/repositories/crm/SettingsRepository';

import type {
    Setting,
    SettingStatus,
} from '@/types/crm/Settings';

class SettingsService {

    list() {

        return SettingsRepositoryInstance.list();

    }

    listArchived() {

        return SettingsRepositoryInstance.listArchived();

    }

    details(
        id: string,
    ) {

        return SettingsRepositoryInstance.details(
            id,
        );

    }

    create(
        data: Partial<Setting>,
    ) {

        return SettingsRepositoryInstance.create(
            data,
        );

    }

    update(
        id: string,
        data: Partial<Setting>,
    ) {

        return SettingsRepositoryInstance.update(
            id,
            data,
        );

    }

    updateStatus(
        id: string,
        status: SettingStatus,
    ) {

        return SettingsRepositoryInstance.updateStatus(
            id,
            status,
        );

    }

    delete(
        id: string,
    ) {

        return SettingsRepositoryInstance.delete(
            id,
        );

    }

    restore(
        id: string,
    ) {

        return SettingsRepositoryInstance.restore(
            id,
        );

    }

    summary() {

        return SettingsRepositoryInstance.summary();

    }

}

export async function createSettingsService() {

    return new SettingsService();

}

export const
    SettingsServiceInstance =
        new SettingsService();