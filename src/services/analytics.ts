import { getLeadCounts } from "./leads";

import {
    getActiveClientsCount,
} from "@/modules/clients/services/clients";

import {
    getActiveProjectsCount,
    getProjectRevenue,
} from "@/modules/projects/services/projects";

import {
    getOutstandingRevenue,
    getPaymentsCountByStatus,
    getTotalRevenue,
} from "./payments";


/**
 * ============================================================================
 * CRM ANALYTICS
 * ============================================================================
 *
 * Canonical KPI calculation boundary for the CRM dashboard.
 *
 * Responsibilities:
 *
 * - Load organization-scoped CRM metrics through existing service boundaries.
 * - Normalize external/database numeric values.
 * - Perform deterministic KPI calculations.
 * - Produce a stable dashboard analytics contract.
 * - Prevent invalid numeric values from propagating into UI/business logic.
 *
 * Tenant isolation is NOT implemented in this module.
 *
 * The underlying server-side service/repository/Supabase RLS layers remain
 * responsible for authentication, organization context and authorization.
 *
 * IMPORTANT:
 *
 * This module must remain a server-side dependency because its dependency
 * chain accesses tenant-scoped Supabase data.
 * ============================================================================
 */


export interface CRMAnalytics {

    overview: {

        totalLeads: number;

        newLeads: number;

        contactedLeads: number;

        qualifiedLeads: number;

        proposalLeads: number;

        wonLeads: number;

        lostLeads: number;

        conversionRate: number;

        activeClients: number;

        activeProjects: number;

    };


    revenue: {

        totalRevenue: number;

        outstandingRevenue: number;

        projectedRevenue: number;

        collectionRate: number;

    };


    payments: {

        pending: number;

        paid: number;

        overdue: number;

        cancelled: number;

        paymentSuccessRate: number;

    };


    health: {

        revenue:
            | "excellent"
            | "good"
            | "warning"
            | "critical";

        pipeline:
            | "healthy"
            | "warning"
            | "critical";

    };

}


/**
 * ============================================================================
 * NUMERIC NORMALIZATION
 * ============================================================================
 *
 * Database clients can return numeric database values as numbers or strings.
 * This boundary guarantees that dashboard calculations only operate on finite
 * JavaScript numbers.
 * ============================================================================
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


    if (
        typeof value !== "string" &&
        typeof value !== "bigint"
    ) {

        return 0;

    }


    const parsed =
        Number(value);


    return Number.isFinite(parsed)
        ? parsed
        : 0;

}


/**
 * Normalize a non-negative metric.
 */
function safeNonNegativeNumber(
    value: unknown,
): number {

    return Math.max(
        0,
        safeNumber(value),
    );

}


/**
 * ============================================================================
 * KPI CALCULATIONS
 * ============================================================================
 */


/**
 * Calculate revenue collection percentage.
 *
 * Collection is derived from:
 *
 *     collected = total - outstanding
 *
 * The result is constrained to the valid 0-100 percentage range.
 */
function calculateCollectionRate(
    total: number,
    outstanding: number,
): number {

    const normalizedTotal =
        safeNonNegativeNumber(total);

    const normalizedOutstanding =
        safeNonNegativeNumber(outstanding);


    if (
        normalizedTotal <= 0
    ) {

        return 0;

    }


    const collected =
        Math.max(
            0,
            normalizedTotal -
            normalizedOutstanding,
        );


    const rate =
        (
            collected /
            normalizedTotal
        ) * 100;


    return Number(
        Math.min(
            100,
            Math.max(
                0,
                rate,
            ),
        ).toFixed(1),
    );

}


/**
 * Calculate successful-payment percentage.
 *
 * The caller deliberately controls the denominator so cancelled payments
 * can remain excluded from actionable payment performance.
 */
function calculatePaymentRate(
    paid: number,
    total: number,
): number {

    const normalizedPaid =
        safeNonNegativeNumber(paid);

    const normalizedTotal =
        safeNonNegativeNumber(total);


    if (
        normalizedTotal <= 0
    ) {

        return 0;

    }


    const rate =
        (
            normalizedPaid /
            normalizedTotal
        ) * 100;


    return Number(
        Math.min(
            100,
            Math.max(
                0,
                rate,
            ),
        ).toFixed(1),
    );

}


/**
 * Calculate lead-to-won conversion percentage.
 */
function calculateConversion(
    total: number,
    won: number,
): number {

    const normalizedTotal =
        safeNonNegativeNumber(total);

    const normalizedWon =
        safeNonNegativeNumber(won);


    if (
        normalizedTotal <= 0
    ) {

        return 0;

    }


    const rate =
        (
            normalizedWon /
            normalizedTotal
        ) * 100;


    return Number(
        Math.min(
            100,
            Math.max(
                0,
                rate,
            ),
        ).toFixed(1),
    );

}


/**
 * ============================================================================
 * HEALTH CALCULATIONS
 * ============================================================================
 */


/**
 * Determine revenue health from collection performance and overdue payments.
 *
 * Overdue payment volume takes precedence over collection percentage because
 * a materially overdue payment backlog represents an immediate operational
 * risk even when aggregate collection remains comparatively strong.
 */
function determineRevenueHealth(
    collectionRate: number,
    overdue: number,
): CRMAnalytics["health"]["revenue"] {

    const normalizedCollectionRate =
        safeNonNegativeNumber(
            collectionRate,
        );

    const normalizedOverdue =
        safeNonNegativeNumber(
            overdue,
        );


    if (
        normalizedOverdue > 10
    ) {

        return "critical";

    }


    if (
        normalizedCollectionRate >= 90
    ) {

        return "excellent";

    }


    if (
        normalizedCollectionRate >= 75
    ) {

        return "good";

    }


    if (
        normalizedCollectionRate >= 50
    ) {

        return "warning";

    }


    return "critical";

}


/**
 * Determine pipeline health from the proportion of leads reaching proposal.
 *
 * A completely empty pipeline is considered critical because there is no
 * active sales opportunity to measure.
 */
function determinePipelineHealth(
    totalLeads: number,
    proposalLeads: number,
): CRMAnalytics["health"]["pipeline"] {

    const normalizedTotal =
        safeNonNegativeNumber(
            totalLeads,
        );

    const normalizedProposal =
        safeNonNegativeNumber(
            proposalLeads,
        );


    if (
        normalizedTotal <= 0
    ) {

        return "critical";

    }


    const proposalRatio =
        normalizedProposal /
        normalizedTotal;


    if (
        proposalRatio >= 0.25
    ) {

        return "healthy";

    }


    if (
        proposalRatio >= 0.10
    ) {

        return "warning";

    }


    return "critical";

}


/**
 * ============================================================================
 * CRM ANALYTICS SNAPSHOT
 * ============================================================================
 */


/**
 * Load and calculate the canonical CRM analytics snapshot.
 *
 * Independent data sources are loaded concurrently to minimize dashboard
 * latency while retaining a single stable aggregation boundary.
 */
export async function getCRMAnalytics():
    Promise<CRMAnalytics> {

    const [
        leadCounts,
        activeClients,
        activeProjects,
        projectedRevenue,
        totalRevenue,
        outstandingRevenue,
        payments,
    ] = await Promise.all([

        getLeadCounts(),

        getActiveClientsCount(),

        getActiveProjectsCount(),

        getProjectRevenue(),

        getTotalRevenue(),

        getOutstandingRevenue(),

        getPaymentsCountByStatus(),

    ]);


    /*
     * ------------------------------------------------------------------------
     * Lead metrics
     * ------------------------------------------------------------------------
     */

    const newLeads =
        safeNonNegativeNumber(
            leadCounts?.new,
        );

    const contactedLeads =
        safeNonNegativeNumber(
            leadCounts?.contacted,
        );

    const qualifiedLeads =
        safeNonNegativeNumber(
            leadCounts?.qualified,
        );

    const proposalLeads =
        safeNonNegativeNumber(
            leadCounts?.proposal,
        );

    const wonLeads =
        safeNonNegativeNumber(
            leadCounts?.won,
        );

    const lostLeads =
        safeNonNegativeNumber(
            leadCounts?.lost,
        );


    const totalLeads =
        newLeads +
        contactedLeads +
        qualifiedLeads +
        proposalLeads +
        wonLeads +
        lostLeads;


    /*
     * ------------------------------------------------------------------------
     * Payment metrics
     * ------------------------------------------------------------------------
     */

    const pendingPayments =
        safeNonNegativeNumber(
            payments?.pending,
        );

    const paidPayments =
        safeNonNegativeNumber(
            payments?.paid,
        );

    const overduePayments =
        safeNonNegativeNumber(
            payments?.overdue,
        );

    const cancelledPayments =
        safeNonNegativeNumber(
            payments?.cancelled,
        );


    /*
     * Cancelled payments are deliberately excluded from the successful
     * payment denominator because they no longer represent actionable
     * payment obligations.
     */
    const paymentTotal =
        paidPayments +
        pendingPayments +
        overduePayments;


    /*
     * ------------------------------------------------------------------------
     * Revenue metrics
     * ------------------------------------------------------------------------
     */

    const normalizedTotalRevenue =
        safeNonNegativeNumber(
            totalRevenue,
        );

    const normalizedOutstandingRevenue =
        safeNonNegativeNumber(
            outstandingRevenue,
        );

    const normalizedProjectedRevenue =
        safeNonNegativeNumber(
            projectedRevenue,
        );


    /*
     * ------------------------------------------------------------------------
     * Derived KPIs
     * ------------------------------------------------------------------------
     */

    const conversionRate =
        calculateConversion(
            totalLeads,
            wonLeads,
        );


    const collectionRate =
        calculateCollectionRate(
            normalizedTotalRevenue,
            normalizedOutstandingRevenue,
        );


    const paymentSuccessRate =
        calculatePaymentRate(
            paidPayments,
            paymentTotal,
        );


    /*
     * ------------------------------------------------------------------------
     * Final stable snapshot
     * ------------------------------------------------------------------------
     */

    return {

        overview: {

            totalLeads,

            newLeads,

            contactedLeads,

            qualifiedLeads,

            proposalLeads,

            wonLeads,

            lostLeads,

            conversionRate,

            activeClients:
                safeNonNegativeNumber(
                    activeClients,
                ),

            activeProjects:
                safeNonNegativeNumber(
                    activeProjects,
                ),

        },


        revenue: {

            totalRevenue:
                normalizedTotalRevenue,

            outstandingRevenue:
                normalizedOutstandingRevenue,

            projectedRevenue:
                normalizedProjectedRevenue,

            collectionRate,

        },


        payments: {

            pending:
                pendingPayments,

            paid:
                paidPayments,

            overdue:
                overduePayments,

            cancelled:
                cancelledPayments,

            paymentSuccessRate,

        },


        health: {

            revenue:
                determineRevenueHealth(
                    collectionRate,
                    overduePayments,
                ),

            pipeline:
                determinePipelineHealth(
                    totalLeads,
                    proposalLeads,
                ),

        },

    };

}