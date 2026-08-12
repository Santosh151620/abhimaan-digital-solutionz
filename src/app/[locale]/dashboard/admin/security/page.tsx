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
 * - Present RBAC and governance areas.
 * - Maintain CRM administration boundary separation.
 *
 * Does NOT:
 *
 * - Manage platform authentication.
 * - Modify Supabase auth configuration.
 * - Control global ADS policies.
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
            "Organization Users",

        description:
            "Manage organization users, memberships and account lifecycle controls.",

        href:
            "/dashboard/admin/users",

    },


    {
        title:
            "Roles & Access Control",

        description:
            "Configure organization roles and CRM capability access.",

        href:
            "/dashboard/admin/roles",

    },


    {
        title:
            "Permissions",

        description:
            "Manage permission definitions used by organization roles.",

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
            "Review organization administrative activity and security events.",

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
                        group-hover:translate-x-1
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
                        text-3xl
                        font-bold
                        text-foreground
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

                    Manage organization-level access control,
                    permissions, user governance and CRM security operations.

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