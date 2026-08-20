import { unstable_noStore as noStore } from "next/cache";

import { getCRMAnalytics } from "./analytics";

import {
    getExecutiveIntelligence,
} from "./crm/executive-intelligence";

import {
    getRevenueForecast,
} from "./crm/revenue-forecast";

import {
    getWorkflowIntelligence,
} from "./crm/workflow-intelligence";


/**
 * ============================================================================
 * CRM DASHBOARD SNAPSHOT
 * ============================================================================
 *
 * Server-side aggregation boundary for the CRM dashboard.
 *
 * Responsibilities:
 *
 * - Prevent request-level caching of tenant/user-specific dashboard data.
 * - Load independent intelligence domains concurrently.
 * - Return one stable snapshot contract to the dashboard page.
 * - Preserve compatibility with existing dashboard consumers.
 * - Keep database access and tenant isolation below the service boundary.
 *
 * IMPORTANT:
 *
 * This service must remain server-only by dependency chain.
 *
 * Individual repositories/services are responsible for:
 *
 * - Authentication.
 * - Organization context.
 * - Authorization.
 * - Supabase RLS enforcement.
 *
 * This module must NOT introduce a competing tenant-context mechanism.
 * ============================================================================
 */


/**
 * ============================================================================
 * SNAPSHOT CONTRACT
 * ============================================================================
 *
 * The complete dashboard contract intentionally exposes both:
 *
 * 1. The complete workflow snapshot.
 * 2. Flattened workflow fields retained for existing dashboard consumers.
 *
 * Do not remove the flattened fields without first migrating all consumers.
 * ============================================================================
 */
export interface DashboardSnapshot {

    metrics:
        Awaited<
            ReturnType<
                typeof getCRMAnalytics
            >
        >;


    executive:
        Awaited<
            ReturnType<
                typeof getExecutiveIntelligence
            >
        >;


    workflow:
        Awaited<
            ReturnType<
                typeof getWorkflowIntelligence
            >
        >;


    pipeline:
        Awaited<
            ReturnType<
                typeof getWorkflowIntelligence
            >
        >["pipeline"]["stages"];


    revenue:
        Awaited<
            ReturnType<
                typeof getWorkflowIntelligence
            >
        >["revenue"];


    forecast:
        Awaited<
            ReturnType<
                typeof getRevenueForecast
            >
        >;


    today:
        Awaited<
            ReturnType<
                typeof getWorkflowIntelligence
            >
        >["today"];


    copilot:
        Awaited<
            ReturnType<
                typeof getWorkflowIntelligence
            >
        >["copilot"];

}


/**
 * ============================================================================
 * DASHBOARD SNAPSHOT
 * ============================================================================
 *
 * Returns the complete server-side CRM dashboard snapshot.
 *
 * noStore() is intentional.
 *
 * The snapshot contains organization-scoped CRM data and therefore must not
 * be shared through Next.js caching between requests/users/organizations.
 *
 * All independent intelligence domains are loaded concurrently to minimize
 * dashboard latency.
 *
 * NOTE:
 *
 * Individual domain services may themselves perform overlapping reads.
 * That is intentionally preserved at this aggregation boundary because this
 * service is responsible for composing the established contracts rather than
 * silently changing domain ownership or business calculations.
 * ============================================================================
 */
export async function getDashboardSnapshot():
    Promise<DashboardSnapshot> {

    noStore();


    const [
        metrics,
        workflow,
        executive,
        forecast,
    ] = await Promise.all([

        getCRMAnalytics(),

        getWorkflowIntelligence(),

        getExecutiveIntelligence(),

        getRevenueForecast(),

    ]);


    /**
     * Defensive contract assertion.
     *
     * Promise.all should either return valid domain results or reject.
     * This guard protects the aggregation boundary from accidental nullish
     * workflow responses introduced by future service changes without
     * changing the established return contract.
     */
    if (!workflow) {

        throw new Error(
            "CRM dashboard workflow intelligence is unavailable.",
        );

    }


    return {

        metrics,

        executive,

        workflow,

        pipeline:
            workflow.pipeline.stages,

        revenue:
            workflow.revenue,

        forecast,

        today:
            workflow.today,

        copilot:
            workflow.copilot,

    };

}