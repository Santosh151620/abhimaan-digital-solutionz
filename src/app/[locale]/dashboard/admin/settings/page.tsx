import Link from "next/link";


/**
 * ============================================================================
 * ADS CRM — ORGANIZATION SETTINGS ADMINISTRATION
 * ============================================================================
 *
 * Route:
 *
 * /[locale]/dashboard/admin/settings
 *
 * Responsibility:
 *
 * Organization workspace configuration.
 *
 * Boundary:
 *
 * This page belongs to CRM Organization Administration.
 *
 * It does NOT manage:
 *
 * - ADS platform configuration
 * - global system settings
 * - infrastructure secrets
 * - master tenant controls
 *
 * ============================================================================
 */


interface OrganizationSetting {

    title:string;

    description:string;

    href:string;

}



const SETTINGS:OrganizationSetting[] = [

    {
        title:
            "Workspace Configuration",

        description:
            "Manage organization profile, workspace defaults and CRM behaviour.",

        href:
            "/dashboard/admin/organization",
    },


    {
        title:
            "CRM Preferences",

        description:
            "Configure CRM workflow defaults, views and business preferences.",

        href:
            "/dashboard/admin/settings/crm",
    },


    {
        title:
            "Localization",

        description:
            "Manage timezone, language, date and regional display settings.",

        href:
            "/dashboard/admin/organization/localization",
    },


    {
        title:
            "Notifications",

        description:
            "Configure organization notification and communication preferences.",

        href:
            "/dashboard/admin/settings/notifications",
    },


    {
        title:
            "Security Policies",

        description:
            "Manage organization-level security controls and access policies.",

        href:
            "/dashboard/admin/security",
    },


    {
        title:
            "Module Preferences",

        description:
            "Enable or configure available CRM business modules.",

        href:
            "/dashboard/admin/modules",
    },

];



function SettingsCard({
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
                rounded-2xl
                border
                bg-background
                p-5
                transition
                hover:bg-muted/40
                hover:border-primary/40
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
                Configure →
            </span>


        </Link>

    );

}



export default function OrganizationSettingsPage() {


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
                    bg-background
                    p-6
                "
            >

                <p
                    className="
                        text-xs
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
                    Settings
                </h1>


                <p
                    className="
                        mt-3
                        max-w-3xl
                        text-sm
                        text-muted-foreground
                    "
                >
                    Configure your organization workspace, CRM preferences,
                    regional settings and operational policies.
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
                    SETTINGS.map(
                        setting => (

                            <SettingsCard
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