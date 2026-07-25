export interface PlatformSetting {

    id: string;

    organizationId?: string;

    category: string;

    key: string;

    value: string;

}

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