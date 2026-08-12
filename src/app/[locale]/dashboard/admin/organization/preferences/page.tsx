import type {
    OrganizationSetting,
} from "@/types/admin/OrganizationSetting";



/**
 * ============================================================================
 * ADS CRM — ORGANIZATION ADMINISTRATION
 *
 * Workspace Preferences
 *
 * Route:
 *
 * /[locale]/dashboard/admin/organization/preferences
 *
 * Boundary:
 *
 * Customer Organization Administration
 *
 * Responsibilities:
 *
 * - Configure organization workspace defaults.
 * - Provide preference management entry point.
 *
 * Does NOT:
 *
 * - Manage individual user preferences.
 * - Override user-level settings.
 * - Control platform preferences.
 *
 * ============================================================================
 */



const PREFERENCE_SETTINGS: OrganizationSetting[] = [

    {
        title:
            "Default Dashboard",

        description:
            "Configure the default landing dashboard for organization users.",

        key:
            "dashboard",

    },


    {
        title:
            "Workspace Behaviour",

        description:
            "Configure workspace interaction defaults.",

        key:
            "workspace",

    },


    {
        title:
            "Notification Defaults",

        description:
            "Configure organization notification preferences.",

        key:
            "notifications",

    },


    {
        title:
            "User Experience",

        description:
            "Configure accessibility and usability defaults.",

        key:
            "experience",

    },


];





function PreferenceCard({

    setting,

}:{

    setting:OrganizationSetting;

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





export default function OrganizationPreferencesPage() {


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

                    Workspace Preferences

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

                    Configure organization-wide workspace defaults,
                    notifications and user experience preferences.

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
                    PREFERENCE_SETTINGS.map(

                        setting => (

                            <PreferenceCard

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