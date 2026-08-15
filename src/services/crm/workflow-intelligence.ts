import {
    getInactiveLeads,
} from "./lead-intelligence";

import {
    getPipelineData,
} from "./pipeline";

import {
    getRevenueIntelligence,
} from "./revenue-intelligence";

import {
    getProjects,
} from "@/modules/projects/services/projects";


/**
 * ============================================================================
 * CRM WORKFLOW INTELLIGENCE
 * ============================================================================
 *
 * Produces operational recommendations used by:
 *
 * - Today's Work
 * - Sales Copilot
 * - Workflow dashboard sections
 *
 * This layer does not mutate CRM records. It only derives recommendations
 * from the current organization-scoped CRM state.
 * ============================================================================
 */


interface WorkflowLead {

    id: string;

    name: string;

    email: string;

}


interface TodayTask {

    id: string;

    title: string;

    description?: string;

    priority:
        | "high"
        | "medium"
        | "low";

    type:
        | "call"
        | "follow_up"
        | "deal"
        | "task";

}


export interface WorkflowSnapshot {

    inactiveLeads:
        Awaited<
            ReturnType<
                typeof getInactiveLeads
            >
        >;

    pipeline:
        Awaited<
            ReturnType<
                typeof getPipelineData
            >
        >;

    revenue:
        Awaited<
            ReturnType<
                typeof getRevenueIntelligence
            >
        >;

    projects:
        Awaited<
            ReturnType<
                typeof getProjects
            >
        >;

    copilot: {

        callToday:
            WorkflowLead[];

        followUpUrgent:
            WorkflowLead[];

        highConversionLeads:
            WorkflowLead[];

    };

    today:
        TodayTask[];

}


/**
 * Convert a pipeline/lead record to the intentionally small workflow
 * representation consumed by the dashboard.
 */
function toWorkflowLead(
    lead: {
        id: string;
        full_name: string;
        email: string;
    },
): WorkflowLead {

    return {

        id:
            lead.id,

        name:
            lead.full_name?.trim() ||
            "Unnamed lead",

        email:
            lead.email?.trim() ||
            "",

    };

}


/**
 * Remove duplicate leads while preserving the first occurrence.
 */
function uniqueLeads(
    leads: WorkflowLead[],
): WorkflowLead[] {

    const seen =
        new Set<string>();


    return leads.filter(
        (
            lead,
        ) => {

            if (
                seen.has(
                    lead.id,
                )
            ) {

                return false;

            }


            seen.add(
                lead.id,
            );


            return true;

        },
    );

}


/**
 * Build workflow intelligence from the current CRM state.
 */
export async function getWorkflowIntelligence():
    Promise<WorkflowSnapshot> {

    const [
        inactiveLeads,
        pipeline,
        revenue,
        projects,
    ] =
        await Promise.all([

            getInactiveLeads(),

            getPipelineData(),

            getRevenueIntelligence(),

            getProjects(),

        ]);


    const activeLeads = [

        ...pipeline.stages.new,

        ...pipeline.stages.contacted,

        ...pipeline.stages.qualified,

        ...pipeline.stages.proposal,

    ];


    /*
     * Preserve pipeline ordering while preventing the same lead from appearing
     * in multiple dashboard recommendations.
     */
    const callToday =
        uniqueLeads(

            activeLeads
                .slice(0, 5)
                .map(
                    toWorkflowLead,
                ),

        );


    const followUpUrgent =
        uniqueLeads(

            inactiveLeads
                .slice(0, 5)
                .map(
                    toWorkflowLead,
                ),

        );


    const highConversionLeads =
        uniqueLeads(

            activeLeads
                .filter(
                    (
                        lead,
                    ) =>
                        lead.priority ===
                        "hot",
                )
                .slice(0, 5)
                .map(
                    toWorkflowLead,
                ),

        );


    const today:
        TodayTask[] = [];


    for (
        const lead of
        callToday
    ) {

        today.push({

            id:
                `call-${lead.id}`,

            title:
                `Call ${lead.name}`,

            description:
                lead.email ||
                undefined,

            priority:
                "high",

            type:
                "call",

        });

    }


    for (
        const lead of
        followUpUrgent
    ) {

        /*
         * Do not create a duplicate follow-up task if the lead has already
         * been selected for today's high-priority call list.
         */
        if (
            callToday.some(
                (
                    call,
                ) =>
                    call.id ===
                    lead.id,
            )
        ) {

            continue;

        }


        today.push({

            id:
                `follow-${lead.id}`,

            title:
                `Follow up with ${lead.name}`,

            description:
                lead.email ||
                undefined,

            priority:
                "medium",

            type:
                "follow_up",

        });

    }


    for (
        const lead of
        highConversionLeads
    ) {

        if (
            today.some(
                (
                    task,
                ) =>
                    task.id ===
                    `call-${lead.id}` ||
                    task.id ===
                    `follow-${lead.id}`,
            )
        ) {

            continue;

        }


        today.push({

            id:
                `deal-${lead.id}`,

            title:
                `Close deal with ${lead.name}`,

            description:
                lead.email ||
                undefined,

            priority:
                "high",

            type:
                "deal",

        });

    }


    return {

        inactiveLeads,

        pipeline,

        revenue,

        projects,

        copilot: {

            callToday,

            followUpUrgent,

            highConversionLeads,

        },

        today,

    };

}