import type {
    PlatformSetting,
    SettingCategory,
} from "@/types/admin/Settings";


import type {
    ISettingsRepository,
} from "@/repositories/admin/SettingsRepository";



export class SettingsService {


    constructor(

        private readonly repository:
            ISettingsRepository,

    ) {}





    async list():

    Promise<PlatformSetting[]> {


        return this.repository.list();


    }







    async find(

        category: SettingCategory,

        key: string,

    ):

    Promise<PlatformSetting | null> {


        this.validateCategory(
            category,
        );


        this.validateKey(
            key,
        );


        return this.repository.find(

            category,

            key.trim(),

        );


    }


async findByCategory(
    category: SettingCategory,
): Promise<{
    category: SettingCategory;
    settings: PlatformSetting[];
}>

     {
        this.validateCategory(
            category,
        );

        return this.repository.findByCategory(

            category,

        );


    }

    async findByKey(
        key:string,
    ) : Promise<PlatformSetting | null> {
        this.validateKey(
            key,
        );
        return this.repository.findByKey(

            key.trim(),
       );
    }

    async save(
        setting: PlatformSetting,
    ):
    Promise<void> {
        this.validateSetting(
            setting,
        );
        await this.repository.save(

            {
                ...setting,
                category:
                   setting.category,
                key:
                    setting.key
                        .trim(),
                updatedAt:
                    new Date()
                        .toISOString(),
            },
        );
    }

    private validateSetting(
        setting: PlatformSetting,
    ) {
        if(!setting) {
            throw new Error(
                "Setting is required.",
            );
        }
        this.validateCategory(
            setting.category,
        );

        this.validateKey(
            setting.key,
        );
    }

    private validateCategory(
        category: SettingCategory,
    ) {
        if(
            !category ||
            !String(category).trim()
        ) {

            throw new Error(
                "Setting category is required.",
            );
        }
    }
    private validateKey(
        key:string,
    ) {
        if(!key?.trim()) {
            throw new Error(
                "Setting key is required.",
            );
        }
    }
}