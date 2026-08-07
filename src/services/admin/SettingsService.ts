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

                key:
                    setting.key
                        .trim(),

                updatedAt:
                    new Date()
                        .toISOString(),

            },

        );


    }









    async findByCategory(

        category: SettingCategory,

    ) {



        this.validateCategory(

            category,

        );



        return this.repository.findByCategory(

            category,

        );


    }









    async findByKey(

        key:string,

    ) {



        this.validateKey(

            key,

        );



        return this.repository.findByKey(

            key.trim(),

        );


    }









    private validateSetting(

        setting: PlatformSetting,

    ) {



        if(!setting.category) {


            throw new Error(

                "Setting category is required.",

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



        if(!category) {


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