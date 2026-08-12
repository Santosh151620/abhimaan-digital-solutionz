import Link from "next/link";


/**
 * ============================================================================
 * ADS CRM — ORGANIZATION PERMISSION ADMINISTRATION
 * ============================================================================
 *
 * Route:
 *
 * /[locale]/dashboard/admin/permissions
 *
 * Purpose:
 *
 * Organization scoped permission administration entry point.
 *
 * Boundary:
 *
 * CRM Organization Administration
 *
 * This page belongs to:
 *
 * /dashboard/admin
 *
 * It is NOT part of:
 *
 * /admin/permissions
 *
 * which is reserved for ADS Platform Master Control Center.
 *
 * Responsibilities:
 *
 * - Provide organization permission navigation.
 * - Provide workspace access configuration entry points.
 * - Maintain CRM administration boundary separation.
 *
 * Does NOT:
 *
 * - Create platform permissions.
 * - Modify ADS global capabilities.
 * - Manage infrastructure security policies.
 * - Access permission repositories directly.
 *
 * Permission business rules remain owned by CRM services.
 *
 * ============================================================================
 */


interface PermissionArea {

    title:string;

    description:string;

    href:string;

}



const PERMISSION_AREAS:PermissionArea[] = [

    {
        title:
            "Workspace Access",

        description:
            "Manage what organization members can access inside the CRM workspace.",

        href:
            "/dashboard/admin/permissions/workspace",
    },


    {
        title:
            "Module Access",

        description:
            "Configure access availability for enabled CRM modules.",

        href:
            "/dashboard/admin/permissions/modules",
    },


    {
        title:
            "Team Permissions",

        description:
            "Manage access rules across teams and departments.",

        href:
            "/dashboard/admin/permissions/teams",
    },


    {
        title:
            "Access Review",

        description:
            "Review organization access changes and administrative activity.",

        href:
            "/dashboard/admin/permissions/review",
    },

];



function PermissionCard({
    area,
}:{
    area:PermissionArea;
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

                <div>

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



export default function OrganizationPermissionsAdminPage(){

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
                    "
                >
                    Permissions
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
                    Configure organization-level access,
                    workspace controls and CRM module availability.
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
                    PERMISSION_AREAS.map(
                        area => (

                            <PermissionCard
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


        </main>

    );

}