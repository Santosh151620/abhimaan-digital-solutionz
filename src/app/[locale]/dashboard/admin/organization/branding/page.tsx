import type {
    OrganizationSetting,
} from "@/types/admin/OrganizationSetting";



/**
 * ============================================================================
 * ADS CRM — ORGANIZATION ADMINISTRATION
 *
 * Branding Configuration
 *
 * Route:
 *
 * /[locale]/dashboard/admin/organization/branding
 *
 * Boundary:
 *
 * Customer Organization Administration
 *
 * Responsibilities:
 *
 * - Display branding configuration area.
 * - Provide organization visual preference entry point.
 *
 * Does NOT:
 *
 * - Manage ADS platform branding.
 * - Modify website global theme.
 * - Control system configuration.
 *
 * ============================================================================
 */



const BRANDING_SETTINGS: OrganizationSetting[] = [

    {
        title:
            "Organization Logo",

        description:
            "Configure organization logo and identity assets.",

        key:
            "logo",

    },

    {
        title:
            "Brand Colors",

        description:
            "Configure organization primary and secondary colors.",

        key:
            "colors",

    },

    {
        title:
            "Workspace Appearance",

        description:
            "Configure CRM workspace visual preferences.",

        key:
            "appearance",

    },

    {
        title:
            "Email Branding",

        description:
            "Configure organization communication branding.",

        key:
            "email-branding",

    },

];




function BrandingCard({

    setting,

}:{

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





export default function OrganizationBrandingPage() {


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
                    "
                >

                    Branding

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

                    Configure organization branding,
                    appearance preferences and workspace identity.

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
                    BRANDING_SETTINGS.map(

                        setting => (

                            <BrandingCard

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