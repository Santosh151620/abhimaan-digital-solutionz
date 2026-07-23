import type {
    Setting,
    SettingStatus,
} from '@/types/crm/Settings';

class SettingsRepository {

    private settings =
        new Map<string, Setting>();

    list() {

        return Array.from(
            this.settings.values(),
        ).filter(
            setting => !setting.archived,
        );

    }

    listArchived() {

        return Array.from(
            this.settings.values(),
        ).filter(
            setting => setting.archived,
        );

    }

    details(
        id: string,
    ) {

        return this.settings.get(id) ?? null;

    }

    create(
        data: Partial<Setting>,
    ): Setting {

        const now =
            new Date().toISOString();

        const setting: Setting = {

            id:
                crypto.randomUUID(),

            settingNumber:
                data.settingNumber ??
                `SET-${Date.now()}`,

            companyId:
                data.companyId,

            category:
                data.category ??
                'General',

            key:
                data.key ?? '',

            name:
                data.name ?? '',

            description:
                data.description,

            value:
                data.value ?? '',

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

            createdAt:
                now,

            updatedAt:
                now,

        };

        this.settings.set(
            setting.id,
            setting,
        );

        return setting;

    }

    update(
        id: string,
        data: Partial<Setting>,
    ) {

        const existing =
            this.settings.get(id);

        if (!existing) {

            return null;

        }

        const updated: Setting = {

            ...existing,

            ...data,

            updatedAt:
                new Date().toISOString(),

        };

        this.settings.set(
            id,
            updated,
        );

        return updated;

    }

    updateStatus(
        id: string,
        status: SettingStatus,
    ) {

        return this.update(
            id,
            {
                status,
            },
        );

    }

    delete(
        id: string,
    ) {

        const setting =
            this.settings.get(id);

        if (!setting) {

            return false;

        }

        setting.archived = true;

        setting.updatedAt =
            new Date().toISOString();

        this.settings.set(
            id,
            setting,
        );

        return true;

    }

    restore(
        id: string,
    ) {

        const setting =
            this.settings.get(id);

        if (!setting) {

            return false;

        }

        setting.archived = false;

        setting.updatedAt =
            new Date().toISOString();

        this.settings.set(
            id,
            setting,
        );

        return true;

    }

    summary() {

        const settings =
            this.list();

        return {

            total:
                settings.length,

            active:
                settings.filter(
                    s => s.status === 'Active',
                ).length,

            inactive:
                settings.filter(
                    s => s.status === 'Inactive',
                ).length,

            editable:
                settings.filter(
                    s => s.editable,
                ).length,

            encrypted:
                settings.filter(
                    s => s.encrypted,
                ).length,

        };

    }

}

export const
    SettingsRepositoryInstance =
        new SettingsRepository();