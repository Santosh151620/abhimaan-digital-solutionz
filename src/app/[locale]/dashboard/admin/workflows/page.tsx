import Link from "next/link";


/**
 * ============================================================================
 * ADS CRM — ORGANIZATION WORKFLOW ADMINISTRATION
 * ============================================================================
 *
 * Route:
 *
 * /[locale]/dashboard/admin/workflows
 *
 * Responsibility:
 *
 * Organization workflow automation configuration.
 *
 * Boundary:
 *
 * This belongs to Customer Organization Administration.
 *
 * It does NOT manage:
 *
 * - ADS platform automation engine
 * - global system workflows
 * - infrastructure jobs
 * - background system processes
 *
 * ============================================================================
 */


interface WorkflowArea {

    title:string;

    description:string;

    href:string;

}



const WORKFLOW_AREAS:WorkflowArea[] = [

    {
        title:
            "CRM Automation",

        description:
            "Configure lead, contact, opportunity and customer relationship workflows.",

        href:
            "/dashboard/admin/workflows/crm",
    },


    {
        title:
            "Sales Workflows",

        description:
            "Manage sales stages, approvals, follow-ups and revenue process automation.",

        href:
            "/dashboard/admin/workflows/sales",
    },


    {
        title:
            "Notification Workflows",

        description:
            "Configure alerts, reminders and organization communication rules.",

        href:
            "/dashboard/admin/workflows/notifications",
    },


    {
        title:
            "Approval Workflows",

        description:
            "Manage organization approval processes and business controls.",

        href:
            "/dashboard/admin/workflows/approvals",
    },


    {
        title:
            "Customer Success Workflows",

        description:
            "Configure customer onboarding, support and retention processes.",

        href:
            "/dashboard/admin/workflows/customer-success",
    },


    {
        title:
            "Workflow Monitoring",

        description:
            "Review workflow activity, execution history and operational status.",

        href:
            "/dashboard/admin/workflows/monitoring",
    },


];



function WorkflowCard({
    workflow,
}:{
    workflow:WorkflowArea;
}) {

    return (

        <Link
            href={
                workflow.href
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
                hover:bg-muted/40
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
                    workflow.title
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
                    workflow.description
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



export default function OrganizationWorkflowsPage() {


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
                    Workflows
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
                    Configure organization-level automation,
                    approvals, CRM processes and operational workflows.
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
                    WORKFLOW_AREAS.map(
                        workflow => (

                            <WorkflowCard
                                key={
                                    workflow.href
                                }
                                workflow={
                                    workflow
                                }
                            />

                        ),
                    )
                }

            </section>


        </main>

    );

}