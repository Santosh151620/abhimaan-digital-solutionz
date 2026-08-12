import type {
    OrganizationSetting,
} from "@/types/admin/OrganizationSetting";



/**
 * ============================================================================
 * ADS CRM — ORGANIZATION ADMINISTRATION
 *
 * Localization Configuration
 *
 * Route:
 *
 * /[locale]/dashboard/admin/organization/localization
 *
 * Boundary:
 *
 * Customer Organization Administration
 *
 * Responsibilities:
 *
 * - Configure organization regional preferences.
 * - Provide localization administration entry point.
 *
 * Does NOT:
 *
 * - Change platform language settings.
 * - Override application translations.
 * - Modify user authentication.
 *
 * ============================================================================
 */



const LOCALIZATION_SETTINGS: OrganizationSetting[] = [

    {
        title:
            "Default Language",

        description:
            "Configure the default language used for organization workspace.",

        key:
            "language",

    },


    {
        title:
            "Timezone",

        description:
            "Configure organization default timezone.",

        key:
            "timezone",

    },


    {
        title:
            "Date Format",

        description:
            "Configure organization date display preferences.",

        key:
            "date-format",

    },


    {
        title:
            "Number Format",

        description:
            "Configure regional number and decimal formatting.",

        key:
            "number-format",

    },


];




function LocalizationCard({

    setting,

}: {

    setting: OrganizationSetting;

}) {


    return (

        <div
            className="
                rounded-xl
                border
                border-border
                bg-background
                p-5
            "
        >

            <h2
                className="
                    font-semibold
                    text-foreground
                "
            >

                {
                    setting.title
                }

            </h2>



            <p
                className="
                    mt-2
                    text-sm
                    leading-6
                    text-muted-foreground
                "
            >

                {
                    setting.description
                }

            </p>



            <button
                type="button"
                className="
                    mt-4
                    rounded-md
                    border
                    px-4
                    py-2
                    text-sm
                    hover:bg-muted
                "
            >

                Configure

            </button>


        </div>

    );

}





export default function OrganizationLocalizationPage() {


    return (

        <main
            className="
                min-w-0
                space-y-8
                px-4
                py-6
                sm:px-6
                lg:px-8
            "
        >


            <header
                className="
                    rounded-2xl
                    border
                    border-border
                    bg-background
                    p-6
                "
            >

                <p
                    className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.2em]
                        text-primary
                    "
                >

                    Organization Administration

                </p>



                <h1
                    className="
                        mt-2
                        text-3xl
                        font-bold
                        text-foreground
                    "
                >

                    Localization

                </h1>



                <p
                    className="
                        mt-3
                        max-w-3xl
                        text-sm
                        leading-6
                        text-muted-foreground
                    "
                >

                    Manage organization language,
                    timezone and regional display preferences.

                </p>


            </header>





            <section
                className="
                    grid
                    gap-5
                    md:grid-cols-2
                "
            >

                {
                    LOCALIZATION_SETTINGS.map(

                        setting => (

                            <LocalizationCard

                                key={
                                    setting.key
                                }

                                setting={
                                    setting
                                }

                            />

                        ),

                    )
                }


            </section>


        </main>

    );

}