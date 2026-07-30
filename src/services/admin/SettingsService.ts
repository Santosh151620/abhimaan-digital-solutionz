import type {
    PlatformSetting,
} from "@/types/admin/Settings";

import type {
    ISettingsRepository,
} from "@/repositories/admin/SettingsRepository";

export class SettingsService {

    constructor(

        private readonly repository: ISettingsRepository

    ) {}

    list() {

        return this.repository.list();

    }

    find(

        category: string,

        key: string

    ) {

        return this.repository.find(

            category,

            key

        );

    }

    save(

        setting: PlatformSetting

    ) {

        return this.repository.save(setting);

    }

}
