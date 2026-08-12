import { getLeadCounts } from "./leads";
import { getActiveClientsCount } from "@/modules/clients/services/clients";
import {
  getActiveProjectsCount,
  getProjectRevenue,
} from "@/modules/projects/services/projects";
import {
  getOutstandingRevenue,
  getPaymentsCountByStatus,
  getTotalRevenue,
} from "./payments";

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
    revenue: "excellent" | "good" | "warning" | "critical";
    pipeline: "healthy" | "warning" | "critical";
  };
}

function calculateCollectionRate(
  total: number,
  outstanding: number,
): number {
  if (total <= 0) {
    return 0;
  }

  return Number(
    (((total - outstanding) / total) * 100).toFixed(1),
  );
}

function calculatePaymentRate(
  paid: number,
  total: number,
): number {
  if (total <= 0) {
    return 0;
  }

  return Number(((paid / total) * 100).toFixed(1));
}

function calculateConversion(
  total: number,
  won: number,
): number {
  if (total <= 0) {
    return 0;
  }

  return Number(((won / total) * 100).toFixed(1));
}

function determineRevenueHealth(
  collectionRate: number,
  overdue: number,
): CRMAnalytics["health"]["revenue"] {
  if (overdue > 10) {
    return "critical";
  }

  if (collectionRate >= 90) {
    return "excellent";
  }

  if (collectionRate >= 75) {
    return "good";
  }

  if (collectionRate >= 50) {
    return "warning";
  }

  return "critical";
}

function determinePipelineHealth(
  totalLeads: number,
  proposalLeads: number,
): CRMAnalytics["health"]["pipeline"] {
  if (totalLeads <= 0) {
    return "critical";
  }

  const proposalRatio = proposalLeads / totalLeads;

  if (proposalRatio >= 0.25) {
    return "healthy";
  }

  if (proposalRatio >= 0.1) {
    return "warning";
  }

  return "critical";
}

export async function getCRMAnalytics(): Promise<CRMAnalytics> {
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

  const newLeads = leadCounts.new ?? 0;
  const contactedLeads = leadCounts.contacted ?? 0;
  const qualifiedLeads = leadCounts.qualified ?? 0;
  const proposalLeads = leadCounts.proposal ?? 0;
  const wonLeads = leadCounts.won ?? 0;
  const lostLeads = leadCounts.lost ?? 0;

  const totalLeads =
    newLeads +
    contactedLeads +
    qualifiedLeads +
    proposalLeads +
    wonLeads +
    lostLeads;

  const pendingPayments = payments.pending ?? 0;
  const paidPayments = payments.paid ?? 0;
  const overduePayments = payments.overdue ?? 0;
  const cancelledPayments = payments.cancelled ?? 0;

  /*
   * Cancelled payments are intentionally excluded from the
   * successful-payment denominator because they are not
   * actionable payment obligations.
   */
  const paymentTotal =
    paidPayments +
    pendingPayments +
    overduePayments;

  const conversionRate = calculateConversion(
    totalLeads,
    wonLeads,
  );

  const collectionRate = calculateCollectionRate(
    totalRevenue,
    outstandingRevenue,
  );

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
      activeClients,
      activeProjects,
    },

    revenue: {
      totalRevenue,
      outstandingRevenue,
      projectedRevenue,
      collectionRate,
    },

    payments: {
      pending: pendingPayments,
      paid: paidPayments,
      overdue: overduePayments,
      cancelled: cancelledPayments,
      paymentSuccessRate: calculatePaymentRate(
        paidPayments,
        paymentTotal,
      ),
    },

    health: {
      revenue: determineRevenueHealth(
        collectionRate,
        overduePayments,
      ),
      pipeline: determinePipelineHealth(
        totalLeads,
        proposalLeads,
      ),
    },
  };
}

/**
 * Legacy compatibility helper.
 *
 * Retained because existing dashboard/CRM consumers may
 * import this function directly.
 */
function calculateGrowth(
  current: number,
  previous: number,
): number {
  if (!previous) {
    return 100;
  }

  return ((current - previous) / previous) * 100;
}

/**
 * Public compatibility exports retained for existing consumers.
 */
;
