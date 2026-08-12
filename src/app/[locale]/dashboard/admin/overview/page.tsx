import Link from "next/link";


/**
 * ============================================================================
 * ADS CRM — ADMIN CONTROL CENTER
 * ============================================================================
 *
 * Organization-level CRM administration.
 *
 * Route:
 *
 * /[locale]/dashboard/admin/overview
 *
 * Boundary:
 *
 * ADS Platform Master Control Center
 *        /admin
 *              │
 *              ├── Website Administration
 *              ├── CRM Administration
 *              └── Future ERP Administration
 *
 * This page is intentionally organization-focused.
 *
 * It does not use the ADS Platform Admin service because CRM administration
 * operates inside the customer's organization boundary.
 *
 * It also does not fabricate dashboard metrics where no CRM Admin summary
 * service currently exists.
 *
 * Individual administration areas remain responsible for their own data,
 * authorization and business rules.
 *
 * ============================================================================
 */


interface AdminArea {

    title:string;

    description:string;

    href:string;

    category:
        "organization"
        | "access"
        | "configuration"
        | "governance";

}


const ADMIN_AREAS:AdminArea[] = [

    {
        title:
            "Organization",

        description:
            "Manage organization-level CRM settings, identity and workspace configuration.",

        href:
            "/dashboard/admin/organization",

        category:
            "organization",
    },


    {
        title:
            "Users",

        description:
            "Manage CRM users, account status, profiles and organization membership.",

        href:
            "/dashboard/admin/users",

        category:
            "access",
    },


    {
        title:
            "Roles",

        description:
            "Define organizational roles and assign responsibilities across CRM teams.",

        href:
            "/dashboard/admin/roles",

        category:
            "access",
    },


    {
        title:
            "Permissions",

        description:
            "Control access to CRM capabilities through role-based permissions.",

        href:
            "/dashboard/admin/permissions",

        category:
            "access",
    },


    {
        title:
            "Theme Policy",

        description:
            "Define organization theme policy and control whether users may personalize their CRM appearance.",

        href:
            "/dashboard/admin/theme-policy",

        category:
            "configuration",
    },


    {
        title:
            "Modules",

        description:
            "Enable or disable independently deployable CRM modules for this organization.",

        href:
            "/dashboard/admin/modules",

        category:
            "configuration",
    },


    {
        title:
            "Workflows",

        description:
            "Configure CRM workflow automation and organization-level operational rules.",

        href:
            "/dashboard/admin/workflows",

        category:
            "configuration",
    },


    {
        title:
            "Audit Logs",

        description:
            "Review administrative and security-sensitive activity across the organization.",

        href:
            "/dashboard/admin/audit-logs",

        category:
            "governance",
    },

];


const CATEGORY_LABELS:Record<
    AdminArea["category"],
    string
> = {

    organization:
        "Organization",

    access:
        "Access & Identity",

    configuration:
        "CRM Configuration",

    governance:
        "Governance & Security",

};


function groupAreas(
    areas:AdminArea[],
) {

    return areas.reduce<
        Record<
            AdminArea["category"],
            AdminArea[]
        >
    >(
        (
            groups,
            area,
        ) => {

            groups[area.category].push(
                area,
            );

            return groups;

        },
        {
            organization:[],
            access:[],
            configuration:[],
            governance:[],
        },
    );

}


function AdminAreaCard({
    area,
}:{
    area:AdminArea;
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

                    <h3
                        className="
                            text-base
                            font-semibold
                            text-foreground
                        "
                    >
                        {
                            area.title
                        }
                    </h3>


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


export default function CRMAdminOverviewPage() {

    const groupedAreas =
        groupAreas(
            ADMIN_AREAS,
        );


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
                    shadow-sm
                "
            >

                <div
                    className="
                        max-w-3xl
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
                        CRM Administration
                    </p>


                    <h1
                        className="
                            mt-2
                            text-2xl
                            font-bold
                            tracking-tight
                            text-foreground
                            sm:text-3xl
                        "
                    >
                        CRM Admin Control Center
                    </h1>


                    <p
                        className="
                            mt-3
                            text-sm
                            leading-6
                            text-muted-foreground
                            sm:text-base
                        "
                    >
                        Manage your organization&apos;s CRM users,
                        access policies, modules, workflows, themes
                        and administrative controls from one place.
                    </p>

                </div>

            </header>


            {
                (
                    Object.keys(
                        groupedAreas,
                    ) as AdminArea["category"][]
                ).map(
                    category => {

                        const areas =
                            groupedAreas[
                                category
                            ];


                        if (
                            areas.length === 0
                        ) {
                            return null;
                        }


                        return (

                            <section
                                key={
                                    category
                                }
                                className="
                                    space-y-4
                                "
                                aria-labelledby={
                                    `crm-admin-${category}`
                                }
                            >

                                <div>

                                    <h2
                                        id={
                                            `crm-admin-${category}`
                                        }
                                        className="
                                            text-lg
                                            font-semibold
                                            text-foreground
                                        "
                                    >
                                        {
                                            CATEGORY_LABELS[
                                                category
                                            ]
                                        }
                                    </h2>

                                </div>


                                <div
                                    className="
                                        grid
                                        gap-4
                                        md:grid-cols-2
                                        xl:grid-cols-3
                                    "
                                >

                                    {
                                        areas.map(
                                            area => (

                                                <AdminAreaCard
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

                                </div>

                            </section>

                        );

                    },
                )
            }

        </main>

    );

}