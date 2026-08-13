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


        const normalizedCategory =
            this.validateCategory(

                category,

            );



        const normalizedKey =
            this.validateKey(

                key,

            );



        return this.repository.find(

            normalizedCategory,

            normalizedKey,

        );


    }









    async findByCategory(

        category: SettingCategory,

    ): Promise<{

        category: SettingCategory;

        settings: PlatformSetting[];

    }> {


        const normalizedCategory =
            this.validateCategory(

                category,

            );



        return this.repository.findByCategory(

            normalizedCategory,

        );


    }









    async findByKey(

        key: string,

    ):

    Promise<PlatformSetting | null> {


        const normalizedKey =
            this.validateKey(

                key,

            );



        return this.repository.findByKey(

            normalizedKey,

        );


    }









    async save(

        setting: PlatformSetting,

    ):

    Promise<void> {


        const normalizedSetting =
            this.validateSetting(

                setting,

            );



        await this.repository.save(

            {

                ...setting,


                category:
                    normalizedSetting.category,


                key:
                    normalizedSetting.key,


                updatedAt:

                    new Date()

                        .toISOString(),

            },

        );


    }









    private validateSetting(

        setting: PlatformSetting,

    ): {

        category: SettingCategory;

        key: string;

    } {


        if (!setting) {


            throw new Error(

                "Setting is required.",

            );


        }



        const category =
            this.validateCategory(

                setting.category,

            );



        const key =
            this.validateKey(

                setting.key,

            );



        return {

            category,

            key,

        };


    }









    private validateCategory(

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









    private validateKey(

        key: string,

    ): string {


        const normalizedKey =

            typeof key ===
            "string"

                ? key.trim()

                : "";



        if (!normalizedKey) {


            throw new Error(

                "Setting key is required.",

            );


        }



        return normalizedKey;


    }

}