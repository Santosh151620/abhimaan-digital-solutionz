import Link from "next/link";


/**
 * ============================================================================
 * ADS CRM — ORGANIZATION THEME POLICY ADMINISTRATION
 * ============================================================================
 *
 * Route:
 *
 * /[locale]/dashboard/admin/theme-policy
 *
 * Purpose:
 *
 * Organization-level CRM appearance and personalization policy entry point.
 *
 * Boundary:
 *
 * Customer Organization Administration
 *
 * This is NOT:
 *
 * /admin
 *
 * which belongs to ADS Platform Master Control Center.
 *
 * Responsibilities:
 *
 * - Provide organization theme policy navigation.
 * - Define CRM appearance governance areas.
 * - Maintain organization boundary separation.
 *
 * Does NOT:
 *
 * - Modify global ADS branding.
 * - Control website appearance.
 * - Access database directly.
 *
 * ============================================================================
 */


interface ThemePolicyArea {

    title:string;

    description:string;

    href:string;

}



const THEME_POLICY_AREAS:ThemePolicyArea[] = [

    {
        title:
            "Organization Branding",

        description:
            "Configure organization identity, logo and CRM workspace branding preferences.",

        href:
            "/dashboard/admin/organization/profile",
    },


    {
        title:
            "Theme Preferences",

        description:
            "Manage CRM appearance settings and supported visual preferences.",

        href:
            "/dashboard/admin/theme-policy/preferences",
    },


    {
        title:
            "User Personalization",

        description:
            "Control whether CRM users can personalize their workspace experience.",

        href:
            "/dashboard/admin/theme-policy/personalization",
    },


    {
        title:
            "Display Configuration",

        description:
            "Configure organization display rules, formats and interface preferences.",

        href:
            "/dashboard/admin/organization/formats",
    },

];



function ThemePolicyCard({
    area,
}:{
    area:ThemePolicyArea;
}) {

    return (

        <Link
            href={
                area.href
            }

            className="
                group
                rounded-2xl
                border
                border-border
                bg-background
                p-5
                transition
                hover:border-primary/40
                hover:bg-muted/30
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary
            "
        >

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >

                <div
                    className="
                        min-w-0
                    "
                >

                    <h2
                        className="
                            font-semibold
                            text-foreground
                        "
                    >
                        {
                            area.title
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
                            area.description
                        }
                    </p>

                </div>


                <span
                    aria-hidden="true"
                    className="
                        shrink-0
                        text-lg
                        text-muted-foreground
                        transition
                        group-hover:translate-x-0.5
                        group-hover:text-primary
                    "
                >
                    →
                </span>

            </div>


            <span
                className="
                    mt-4
                    inline-flex
                    text-sm
                    font-medium
                    text-primary
                "
            >
                Configure
            </span>


        </Link>

    );

}



export default function OrganizationThemePolicyPage() {

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
                        tracking-tight
                        text-foreground
                    "
                >
                    Theme Policy
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
                    Manage CRM workspace appearance policies,
                    branding preferences and user personalization controls.
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
                    THEME_POLICY_AREAS.map(
                        area => (

                            <ThemePolicyCard
                                key={
                                    area.href
                                }
                                area={
                                    area
                                }
                            />

                        ),
                    )
                }

            </section>



            <section
                className="
                    rounded-2xl
                    border
                    border-border
                    bg-muted/20
                    p-6
                "
            >

                <h2
                    className="
                        font-semibold
                        text-foreground
                    "
                >
                    Policy Governance
                </h2>


                <p
                    className="
                        mt-2
                        text-sm
                        leading-6
                        text-muted-foreground
                    "
                >
                    Organization theme policies define CRM workspace behavior.
                    Platform branding and global ADS appearance remain managed
                    separately by the Platform Control Center.
                </p>


            </section>


        </main>

    );

}