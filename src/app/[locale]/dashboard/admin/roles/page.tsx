import Link from "next/link";


/**
 * ============================================================================
 * ADS CRM — ORGANIZATION ROLE ADMINISTRATION
 * ============================================================================
 *
 * Route:
 *
 * /[locale]/dashboard/admin/roles
 *
 * Purpose:
 *
 * Organization scoped role administration entry point.
 *
 * Boundary:
 *
 * CRM Organization Administration.
 *
 * This is NOT:
 *
 * /admin/roles
 *
 * which belongs to ADS Platform Master Control Center.
 *
 * Responsibilities:
 *
 * - Organization access model navigation.
 * - Workspace responsibility configuration.
 * - Future organization RBAC extension point.
 *
 * Does NOT:
 *
 * - Manage platform roles.
 * - Manage global permissions.
 * - Modify ADS security policies.
 *
 * ============================================================================
 */


interface RoleArea {

    title:string;

    description:string;

    href:string;

}



const ROLE_AREAS:RoleArea[] = [

    {
        title:
            "Organization Roles",

        description:
            "Create and manage workspace responsibilities for organization members.",

        href:
            "/dashboard/admin/roles/organization",
    },


    {
        title:
            "Team Access",

        description:
            "Configure access responsibilities across teams and departments.",

        href:
            "/dashboard/admin/roles/teams",
    },


    {
        title:
            "Permission Assignment",

        description:
            "Control organization-level access assignments.",

        href:
            "/dashboard/admin/roles/permissions",
    },


    {
        title:
            "Role Audit",

        description:
            "Review organization role changes and access history.",

        href:
            "/dashboard/admin/roles/audit",
    },

];



function RoleCard({
    area,
}:{
    area:RoleArea;
}) {

    return (

        <Link
            href={
                area.href
            }

            className="
    group
    block
    rounded-2xl
    border
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

<span
    className="
        mt-4
        inline-flex
        items-center
        gap-1
        text-sm
        font-medium
        text-primary
        transition
        group-hover:translate-x-1
    "
>
    Configure →
</span>


        </Link>

    );

}



export default function OrganizationRolesAdminPage(){

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
                    Roles
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
                    Configure organization responsibilities,
                    team access and workspace role management.
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
                    ROLE_AREAS.map(
                        area => (

                            <RoleCard
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