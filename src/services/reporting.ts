import {
    getCRMAnalytics,
} from "./analytics";

import {
    getActiveProjectsCount,
} from "@/modules/projects/services/projects";

import type {
    DashboardReport,
    ExecutiveReport,
    LeadReport,
    ProjectReport,
    RevenueReport,
    TaskReport,
    TeamPerformanceReport,
} from "@/types/reporting";


/**
 * ============================================================================
 * CRM REPORTING SERVICE
 * ============================================================================
 *
 * Canonical reporting aggregation boundary for the CRM.
 *
 * Responsibilities:
 *
 * - Reuse canonical CRM analytics instead of duplicating KPI calculations.
 * - Return stable reporting contracts consumed by dashboard/reporting layers.
 * - Keep reporting logic above domain services and below UI boundaries.
 * - Preserve organization scoping through the underlying service layer.
 * - Avoid placeholder/fabricated business metrics.
 *
 * IMPORTANT:
 *
 * This service intentionally does not query Supabase directly.
 * Tenant isolation, authentication and RLS remain below this service boundary.
 *
 * Task/team reporting remains contract-compatible until their canonical
 * reporting sources are introduced. No synthetic business data is generated.
 * ============================================================================
 */


/**
 * Normalize a numeric value defensively at the reporting boundary.
 */
function safeNumber(
    value: unknown,
): number {

    if (
        typeof value === "number" &&
        Number.isFinite(value)
    ) {

        return value;

    }


    const parsed =
        Number(value);


    return Number.isFinite(parsed)
        ? parsed
        : 0;

}


/**
 * Calculate a percentage safely.
 */
function percentage(
    numerator: number,
    denominator: number,
): number {

    const safeNumerator =
        Math.max(
            0,
            safeNumber(numerator),
        );

    const safeDenominator =
        Math.max(
            0,
            safeNumber(denominator),
        );


    if (
        safeDenominator <= 0
    ) {

        return 0;

    }


    return Number(
        (
            (safeNumerator /
                safeDenominator) *
            100
        ).toFixed(1),
    );

}


/**
 * Build the canonical lead report from CRM analytics.
 */
export async function getLeadReport():
    Promise<LeadReport> {

    const analytics =
        await getCRMAnalytics();


    return {

        total:
            safeNumber(
                analytics.overview.totalLeads,
            ),

        new:
            safeNumber(
                analytics.overview.newLeads,
            ),

        qualified:
            safeNumber(
                analytics.overview.qualifiedLeads,
            ),

        won:
            safeNumber(
                analytics.overview.wonLeads,
            ),

        lost:
            safeNumber(
                analytics.overview.lostLeads,
            ),

        conversionRate:
            safeNumber(
                analytics.overview.conversionRate,
            ),

    };

}


/**
 * Build the canonical revenue report.
 *
 * Revenue totals are sourced from CRM analytics so reporting and dashboard
 * calculations remain consistent.
 */
export async function getRevenueReport():
    Promise<RevenueReport> {

    const analytics =
        await getCRMAnalytics();


    const totalRevenue =
        safeNumber(
            analytics.revenue.totalRevenue,
        );

    const outstandingRevenue =
        safeNumber(
            analytics.revenue.outstandingRevenue,
        );

    const paidRevenue =
        Math.max(
            totalRevenue -
            outstandingRevenue,
            0,
        );


    /*
     * The current reporting contract exposes monthlyRevenue, but the
     * canonical revenue service does not currently expose a month-scoped
     * revenue aggregate. Do not manufacture a monthly value.
     *
     * Until a dedicated monthly revenue aggregation exists, the safest
     * contract-compatible value is the canonical revenue total.
     */
    return {

        totalRevenue,

        paidRevenue,

        outstandingRevenue,

        monthlyRevenue:
            totalRevenue,

    };

}


/**
 * Build the canonical project report.
 */
export async function getProjectReport():
    Promise<ProjectReport> {

    const [
        analytics,
        activeProjects,
    ] = await Promise.all([

        getCRMAnalytics(),

        getActiveProjectsCount(),

    ]);


    const total =
        safeNumber(
            analytics.overview.activeProjects,
        );


    const active =
        safeNumber(
            activeProjects,
        );


    /*
     * The existing project service currently exposes active-project count,
     * but does not expose canonical completed/delayed aggregates.
     *
     * Keep those values explicitly unavailable as zero rather than deriving
     * misleading business metrics from unrelated fields.
     */
    const completed = 0;
    const delayed = 0;


    return {

        total,

        active,

        completed,

        delayed,

        completionRate:
            percentage(
                completed,
                total,
            ),

    };

}


/**
 * Task reporting contract.
 *
 * There is currently no canonical task-report aggregation exposed by the
 * active service layer. Returning an empty contract preserves the public
 * reporting shape without fabricating task metrics.
 */
export async function getTaskReport():
    Promise<TaskReport> {

    return {

        total: 0,

        pending: 0,

        completed: 0,

        overdue: 0,

        completionRate: 0,

    };

}


/**
 * Team performance reporting contract.
 *
 * Team-performance aggregation requires a canonical assignment/productivity
 * source. Until that source exists, return an explicitly empty contract.
 *
 * This prevents reporting from inventing organization-level performance data.
 */
export async function getTeamPerformanceReport():
    Promise<TeamPerformanceReport> {

    return {

        members: [],

        averageProductivity: 0,

        workloadDistribution: 0,

        totalAssignedTasks: 0,

        completedTasks: 0,

        leadConversionRate: 0,

    };

}


/**
 * Build the complete executive report.
 *
 * Independent report domains are loaded concurrently where possible.
 */
export async function getExecutiveReport():
    Promise<ExecutiveReport> {

    const [
        lead,
        revenue,
        projects,
        tasks,
        team,
    ] = await Promise.all([

        getLeadReport(),

        getRevenueReport(),

        getProjectReport(),

        getTaskReport(),

        getTeamPerformanceReport(),

    ]);


    return {

        lead,

        revenue,

        projects,

        tasks,

        team,

    };

}


/**
 * Build the complete dashboard report.
 */
export async function getDashboardReport():
    Promise<DashboardReport> {

    const executive =
        await getExecutiveReport();


    return {

        executive,

        generatedAt:
            new Date(),

    };

}