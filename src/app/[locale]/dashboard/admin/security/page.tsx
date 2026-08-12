/**
 * ============================================================================
 * ADS CRM — ORGANIZATION SECURITY ADMINISTRATION
 * ============================================================================
 *
 * Route:
 *
 * /[locale]/dashboard/admin/security
 *
 * Purpose:
 *
 * Organization-level CRM security configuration entry point.
 *
 * Boundary:
 *
 * Customer Organization Administration
 *
 * This is NOT:
 *
 * /admin/security
 *
 * which belongs to ADS Platform Master Control Center.
 *
 * Responsibilities:
 *
 * - Provide organization security navigation.
 * - Present security configuration areas.
 * - Maintain CRM administration boundary separation.
 *
 * Does NOT:
 *
 * - Manage platform authentication.
 * - Modify Supabase auth configuration.
 * - Manage global ADS security policies.
 * - Access database directly.
 *
 * ============================================================================
 */


import Link from "next/link";


interface SecurityArea {

    title:string;

    description:string;

    href:string;

}


const SECURITY_AREAS:SecurityArea[] = [

    {
        title:
            "Access Control",

        description:
            "Manage organization roles, permissions and CRM capability access.",

        href:
            "/dashboard/admin/roles",
    },


    {
        title:
            "User Security",

        description:
            "Review organization users, account status and membership controls.",

        href:
            "/dashboard/admin/users",
    },


    {
        title:
            "Permission Management",

        description:
            "Configure role-based permissions for CRM operations.",

        href:
            "/dashboard/admin/permissions",
    },


    {
        title:
            "Role Permission Mapping",

        description:
            "Assign CRM permissions to organization roles and teams.",

        href:
            "/dashboard/admin/role-permissions",
    },


    {
        title:
            "Audit & Activity Review",

        description:
            "Review administrative activity and security-sensitive actions.",

        href:
            "/dashboard/admin/audit-logs",
    },


];


function SecurityCard({
    area,
}:{
    area:SecurityArea;
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



export default function OrganizationSecurityPage() {

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
                        text-2xl
                        font-bold
                        text-foreground
                        sm:text-3xl
                    "
                >
                    Security Controls
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
                    Manage your organization&apos;s CRM access control,
                    permissions, user security and administrative governance.
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
                    SECURITY_AREAS.map(
                        area => (

                            <SecurityCard
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