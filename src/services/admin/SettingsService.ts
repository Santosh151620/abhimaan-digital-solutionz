import type {
    PlatformSetting,
    SettingCategory,
} from "@/types/admin/Settings";


import type {
    ISettingsRepository,
} from "@/repositories/admin/SettingsRepository";





/**
 * ============================================================================
 * ADS ADMIN — SETTINGS SERVICE
 * ============================================================================
 *
 * Application/service boundary for organization-scoped platform settings.
 *
 * Responsibilities:
 * - Validate application input before reaching the repository.
 * - Normalize setting keys consistently.
 * - Validate supported setting categories at runtime.
 * - Preserve the PlatformSetting domain contract.
 * - Delegate persistence entirely to ISettingsRepository.
 * - Never accept or derive organization identity from caller input.
 * - Never contain Supabase/database-specific persistence logic.
 *
 * Tenant isolation remains the responsibility of SettingsRepository /
 * BaseRepository.
 * ============================================================================
 */





export class SettingsService {





    private static readonly categories:
        readonly SettingCategory[] =
        [

            "General",

            "Security",

            "Authentication",

            "Branding",

            "Localization",

            "Notification",

            "Email",

            "Storage",

            "AI",

            "Integration",

            "Workflow",

            "CRM",

            "Reporting",

            "Billing",

            "System",

        ];



    private static readonly keyPattern =
        /^[a-z0-9._:-]+$/;



    private static readonly maxKeyLength =
        255;



    private static readonly maxNameLength =
        255;





    constructor(

        private readonly repository:
            ISettingsRepository,

    ) {}





    /* ========================================================================
     * READ OPERATIONS
     * ====================================================================== */



    /**
     * Return all organization-scoped platform settings.
     */
    async list():
        Promise<PlatformSetting[]> {


        return this.repository.list();


    }





    /**
     * Find one setting by category and key.
     */
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





    /**
     * Return all settings belonging to a category.
     */
    async findByCategory(

        category: SettingCategory,

    ):
        Promise<{

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





    /**
     * Find one setting by organization-scoped key.
     */
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





    /* ========================================================================
     * WRITE OPERATIONS
     * ====================================================================== */



    /**
     * Create or update an organization-scoped platform setting.
     *
     * The repository owns the actual persistence semantics.
     * organizationId from the incoming domain object is never used as the
     * tenant authority.
     */
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

                name:
                    normalizedSetting.name,

                description:
                    normalizedSetting.description,

            },

        );


    }





    /* ========================================================================
     * VALIDATION
     * ====================================================================== */



    /**
     * Validate the complete setting contract at the service boundary.
     */
    private validateSetting(

        setting: PlatformSetting,

    ): {

        category: SettingCategory;

        key: string;

        name: string;

        description?: string;

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



        const name =
            typeof setting.name === "string"

                ? setting.name.trim()

                : "";



        if (!name) {

            throw new Error(

                "Setting name is required.",

            );

        }



        if (

            name.length >
            SettingsService.maxNameLength

        ) {

            throw new Error(

                "Setting name must not exceed 255 characters.",

            );

        }



        if (!setting.scope) {

            throw new Error(

                "Setting scope is required.",

            );

        }



        if (!setting.valueType) {

            throw new Error(

                "Setting value type is required.",

            );

        }



        const description =

            typeof setting.description === "string"

                ? setting.description.trim()

                : undefined;



        return {

            category,

            key,

            name,

            ...(description

                ? {

                    description,

                }

                : {}),

        };


    }





    /**
     * Validate and normalize the setting category.
     *
     * Runtime validation is required because TypeScript types disappear
     * at runtime and server actions/API boundaries can receive arbitrary
     * values.
     */
    private validateCategory(

        category: SettingCategory,

    ):
        SettingCategory {


        if (

            !category ||

            typeof category !== "string" ||

            !category.trim()

        ) {

            throw new Error(

                "Setting category is required.",

            );

        }



        const normalizedCategory =
            category.trim();



        if (

            !SettingsService.categories.includes(

                normalizedCategory as SettingCategory,

            )

        ) {

            throw new Error(

                `Unsupported setting category: ${normalizedCategory}`,

            );

        }



        return normalizedCategory as SettingCategory;


    }





    /**
     * Validate and normalize a setting key.
     *
     * Keys are canonicalized to lowercase so values such as:
     *
     *     Theme.Policy
     *     theme.policy
     *
     * cannot become two logical settings.
     */
    private validateKey(

        key: string,

    ):
        string {


        const normalizedKey =

            typeof key === "string"

                ? key.trim().toLowerCase()

                : "";



        if (!normalizedKey) {

            throw new Error(

                "Setting key is required.",

            );

        }



        if (

            normalizedKey.length >
            SettingsService.maxKeyLength

        ) {

            throw new Error(

                "Setting key must not exceed 255 characters.",

            );

        }



        if (

            !SettingsService.keyPattern.test(

                normalizedKey,

            )

        ) {

            throw new Error(

                "Setting key may contain only letters, numbers, dots, underscores, colons, and hyphens.",

            );

        }



        return normalizedKey;


    }

}