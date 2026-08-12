import Link from "next/link";


/**
 * ============================================================================
 * ADS CRM — ORGANIZATION ADMINISTRATION
 * ============================================================================
 *
 * Route:
 *
 * /[locale]/dashboard/admin/organization
 *
 * Purpose:
 *
 * Organization-level CRM configuration entry point.
 *
 * Boundary:
 *
 * This belongs to:
 *
 * Customer Organization Administration
 *
 * It is NOT part of:
 *
 * /admin
 *
 * which is reserved for ADS Platform Master Control Center.
 *
 * Responsibilities:
 *
 * - Provide organization administration navigation.
 * - Present workspace configuration areas.
 * - Maintain CRM organization boundary separation.
 *
 * Does NOT:
 *
 * - Access database directly.
 * - Manage platform tenants.
 * - Modify authentication.
 * - Control global ADS settings.
 *
 * ============================================================================
 */


interface OrganizationSetting {

    title:string;

    description:string;

    href:string;

}



const ORGANIZATION_SETTINGS:OrganizationSetting[] = [

    {
        title:
            "Company Profile",

        description:
            "Manage organization information, business identity and workspace details.",

        href:
            "/dashboard/admin/organization/profile",
    },


    {
        title:
            "Branding",

        description:
            "Configure CRM appearance, organization branding and visual preferences.",

        href:
            "/dashboard/admin/organization/branding",
    },


    {
        title:
            "Localization",

        description:
            "Configure language, timezone, date formats and regional preferences.",

        href:
            "/dashboard/admin/organization/localization",
    },


    {
        title:
            "Currency & Formats",

        description:
            "Configure currency, numbering formats and business display preferences.",

        href:
            "/dashboard/admin/organization/formats",
    },


    {
        title:
            "Organization Security",

        description:
            "Manage organization-level security preferences and administrative controls.",

        href:
            "/dashboard/admin/security",
    },


    {
        title:
            "Team Structure",

        description:
            "Manage departments, teams and organizational hierarchy.",

        href:
            "/dashboard/admin/organization/teams",
    },


    {
        title:
            "User Preferences",

        description:
            "Configure organization user defaults and workspace behaviour.",

        href:
            "/dashboard/admin/organization/preferences",
    },


    {
        title:
            "Data Management",

        description:
            "Manage imports, exports, retention and organization data policies.",

        href:
            "/dashboard/admin/organization/data",
    },

];



function SettingCard({
    setting,
}:{
    setting:OrganizationSetting;
}) {

    return (

        <Link
            href={
                setting.href
            }
            className="
                group
                rounded-2xl
                border
                border-border
                bg-background
                p-5
                transition
                hover:border-primary/50
                hover:bg-muted/30
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary
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


            <span
                className="
                    mt-4
                    inline-flex
                    text-sm
                    font-medium
                    text-primary
                "
            >
                Manage →
            </span>


        </Link>

    );

}



export default function OrganizationAdminPage() {


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
                    Organization Settings
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
                    Configure your organization&apos;s CRM workspace,
                    branding, regional preferences, team structure,
                    data policies and security controls.
                </p>

            </header>



            <section
                className="
                    grid
                    gap-5
                    md:grid-cols-2
                    xl:grid-cols-3
                "
            >

                {
                    ORGANIZATION_SETTINGS.map(
                        setting => (

                            <SettingCard
                                key={
                                    setting.href
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