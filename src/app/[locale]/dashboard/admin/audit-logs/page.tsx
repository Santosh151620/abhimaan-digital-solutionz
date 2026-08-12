/**
 * ============================================================================
 * ADS CRM — ORGANIZATION AUDIT LOG ADMINISTRATION
 * ============================================================================
 *
 * Route:
 *
 * /[locale]/dashboard/admin/audit-logs
 *
 * Purpose:
 *
 * Organization-level CRM administrative activity review.
 *
 * Boundary:
 *
 * Customer Organization Administration
 *
 * This is NOT:
 *
 * /admin/audit-logs
 *
 * which belongs to ADS Platform Master Control Center.
 *
 * Responsibilities:
 *
 * - Provide organization audit navigation.
 * - Explain audit governance scope.
 * - Maintain CRM administration separation.
 *
 * Does NOT:
 *
 * - Access platform audit logs.
 * - Expose global ADS events.
 * - Query database directly.
 * - Bypass authorization boundaries.
 *
 * ============================================================================
 */


import Link from "next/link";


interface AuditArea {

    title:string;

    description:string;

    href:string;

}


const AUDIT_AREAS:AuditArea[] = [

    {
        title:
            "Administrative Activity",

        description:
            "Review organization administration actions performed by authorized users.",

        href:
            "/dashboard/admin/audit-logs/activity",
    },


    {
        title:
            "User Access Events",

        description:
            "Monitor user access changes, membership updates and security-related events.",

        href:
            "/dashboard/admin/audit-logs/access",
    },


    {
        title:
            "Configuration Changes",

        description:
            "Track organization configuration, module and workflow changes.",

        href:
            "/dashboard/admin/audit-logs/configuration",
    },


    {
        title:
            "Security Events",

        description:
            "Review security-sensitive actions and governance events.",

        href:
            "/dashboard/admin/security",
    },

];



function AuditCard({
    area,
}:{
    area:AuditArea;
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



export default function OrganizationAuditLogsPage() {


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
                    Audit Logs
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
                    Review organization administrative activity,
                    configuration changes and security-related events
                    within your CRM workspace.
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
                    AUDIT_AREAS.map(
                        area => (

                            <AuditCard
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
                    Audit Governance
                </h2>


                <p
                    className="
                        mt-2
                        text-sm
                        leading-6
                        text-muted-foreground
                    "
                >
                    Audit records are organization-scoped and will only
                    expose activities permitted by the organization security
                    model.
                </p>


            </section>


        </main>

    );

}