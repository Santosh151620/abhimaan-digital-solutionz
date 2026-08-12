import Link from "next/link";


/**
 * ============================================================================
 * ADS CRM — ORGANIZATION MODULE ADMINISTRATION
 * ============================================================================
 *
 * Route:
 *
 * /[locale]/dashboard/admin/modules
 *
 * Purpose:
 *
 * Organization scoped CRM module configuration entry point.
 *
 * Boundary:
 *
 * Customer Organization Administration
 *
 * This is NOT:
 *
 * /admin/modules
 *
 * which belongs to ADS Platform Master Control Center.
 *
 * Responsibilities:
 *
 * - Organization module visibility.
 * - CRM capability configuration.
 * - Future module enable/disable controls.
 *
 * Does NOT:
 *
 * - Create platform modules.
 * - Modify ADS global capabilities.
 * - Control other organizations.
 *
 * ============================================================================
 */


interface ModuleArea {

    title:string;

    description:string;

    href:string;

}



const MODULE_AREAS:ModuleArea[] = [

    {
        title:
            "Enabled CRM Modules",

        description:
            "View and manage CRM modules available to this organization workspace.",

        href:
            "/dashboard/admin/modules/enabled",
    },


    {
        title:
            "Module Availability",

        description:
            "Configure which organization capabilities are active for users.",

        href:
            "/dashboard/admin/modules/availability",
    },


    {
        title:
            "Module Access",

        description:
            "Control which teams and users can access enabled modules.",

        href:
            "/dashboard/admin/modules/access",
    },


    {
        title:
            "Module Audit",

        description:
            "Review organization module changes and administrative history.",

        href:
            "/dashboard/admin/modules/audit",
    },

];



function ModuleCard({
    area,
}:{
    area:ModuleArea;
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
                hover:border-primary/50
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


        </Link>

    );

}



export default function OrganizationModulesAdminPage() {

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
                    Modules
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
                    Manage CRM modules enabled for this organization,
                    including availability and access governance.
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
                    MODULE_AREAS.map(
                        area => (

                            <ModuleCard
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
                    Module Governance
                </h2>


                <p
                    className="
                        mt-2
                        text-sm
                        leading-6
                        text-muted-foreground
                    "
                >
                    Platform capabilities are managed separately by ADS Platform
                    Administration. Organization administrators only control
                    modules available within their own CRM workspace.
                </p>


            </section>


        </main>

    );

}