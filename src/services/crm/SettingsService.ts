import {
    createSupabaseServerClient,
} from '@/lib/supabase/server-client';

import {
    SettingsRepository,
} from '@/repositories/crm/SettingsRepository';

import type {
    Setting,
    SettingStatus,
} from '@/types/crm/Settings';

class SettingsService {

    private async repository(): Promise<SettingsRepository> {

        const supabase =
            await createSupabaseServerClient();

        return new SettingsRepository(
            supabase,
        );
    }

    async list(): Promise<Setting[]> {

        const repository =
            await this.repository();

        return repository.list();

    }

    async listArchived(): Promise<Setting[]> {

        const repository =
            await this.repository();

        return repository.listArchived();

    }

    async details(
        id: string,
    ): Promise<Setting | null> {

        const repository =
            await this.repository();

        return repository.details(
            id,
        );

    }

    async create(
        data: Partial<Setting>,
    ): Promise<Setting> {

        const repository =
            await this.repository();

        return repository.create(
            data,
        );

    }

    async update(
        id: string,
        data: Partial<Setting>,
    ): Promise<Setting> {

        const repository =
            await this.repository();

        return repository.update(
            id,
            data,
        );

    }

    async updateStatus(
        id: string,
        status: SettingStatus,
    ): Promise<Setting> {

        const repository =
            await this.repository();

        return repository.updateStatus(
            id,
            status,
        );

    }

    async delete(
        id: string,
    ): Promise<void> {

        const repository =
            await this.repository();

        return repository.delete(
            id,
        );

    }

    async restore(
        id: string,
    ): Promise<boolean> {

        const repository =
            await this.repository();

        return repository.restore(
            id,
        );

    }

    async summary(): Promise<{
        total: number;
        active: number;
        inactive: number;
        editable: number;
        encrypted: number;
    }> {

        const repository =
            await this.repository();

        return repository.summary();

    }
}

/**
 * Request-safe service facade.
 *
 * A fresh authenticated Supabase server client is created
 * for every operation. Do not convert this into a global
 * Supabase client singleton.
 */
export const SettingsServiceInstance =
    new SettingsService();