import Link from "next/link";


/**
 * ============================================================================
 * ADS CRM — ORGANIZATION USER ADMINISTRATION
 * ============================================================================
 *
 * Route:
 *
 * /[locale]/dashboard/admin/users
 *
 * Purpose:
 *
 * Organization scoped user administration entry point.
 *
 * Boundary:
 *
 * CRM Organization Administration
 *
 * This is NOT:
 *
 * /admin/users
 *
 * which belongs to ADS Platform Master Control Center.
 *
 * Responsibilities:
 *
 * - Provide organization user administration navigation.
 * - Maintain CRM/platform separation.
 * - Provide extension points for membership management.
 *
 * Does NOT:
 *
 * - Manage ADS platform users.
 * - Control global platform roles.
 * - Modify system permissions.
 * - Access another organization.
 *
 * ============================================================================
 */


interface UserAdministrationArea {

    title:string;

    description:string;

    href:string;

}



const USER_ADMINISTRATION_AREAS:UserAdministrationArea[] = [

    {
        title:
            "Organization Members",

        description:
            "Manage people who belong to this organization workspace.",

        href:
            "/dashboard/admin/users/members",
    },


    {
        title:
            "Access & Roles",

        description:
            "Manage organization-level access assignments and responsibilities.",

        href:
            "/dashboard/admin/users/access",
    },


    {
        title:
            "Invitations",

        description:
            "Invite new members and manage pending workspace invitations.",

        href:
            "/dashboard/admin/users/invitations",
    },


    {
        title:
            "User Activity",

        description:
            "Review organization user activity and operational visibility.",

        href:
            "/dashboard/admin/users/activity",
    },


];



function UserAdminCard({
    area,
}:{
    area:UserAdministrationArea;
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



export default function OrganizationUsersAdminPage() {


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
                    Users
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
                    Manage organization members, access configuration
                    and workspace user operations.
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
                    USER_ADMINISTRATION_AREAS.map(
                        area => (

                            <UserAdminCard

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