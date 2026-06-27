import { getLeadCounts } from "./leads";
import { getActiveClientsCount } from "./clients";
import {
  getActiveProjectsCount,
  getProjectRevenue,
} from "./projects";
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
  outstanding: number
) {
  if (total <= 0) return 0;

  return Number(
    (((total - outstanding) / total) * 100).toFixed(1)
  );
}

function calculatePaymentRate(
  paid: number,
  total: number
) {
  if (total <= 0) return 0;

  return Number(((paid / total) * 100).toFixed(1));
}

function calculateConversion(
  total: number,
  won: number
) {
  if (total <= 0) return 0;

  return Number(((won / total) * 100).toFixed(1));
}

function determineRevenueHealth(
  collectionRate: number,
  overdue: number
): CRMAnalytics["health"]["revenue"] {
  if (overdue > 10) return "critical";
  if (collectionRate >= 90) return "excellent";
  if (collectionRate >= 75) return "good";
  if (collectionRate >= 50) return "warning";
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

  const totalLeads = leadCounts.total ?? 0;
  const wonLeads = leadCounts.won ?? 0;

  const conversionRate = calculateConversion(
    totalLeads,
    wonLeads
  );

  const collectionRate = calculateCollectionRate(
    totalRevenue,
    outstandingRevenue
  );

  const paymentTotal =
    (payments.paid ?? 0) +
    (payments.pending ?? 0) +
    (payments.overdue ?? 0);

  return {
    overview: {
      totalLeads,
      newLeads: leadCounts.new ?? 0,
      contactedLeads: leadCounts.contacted ?? 0,
      qualifiedLeads: leadCounts.qualified ?? 0,
      proposalLeads: leadCounts.proposal ?? 0,
      wonLeads,
      lostLeads: leadCounts.lost ?? 0,
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
      pending: payments.pending ?? 0,
      paid: payments.paid ?? 0,
      overdue: payments.overdue ?? 0,
      cancelled: payments.cancelled ?? 0,
      paymentSuccessRate: calculatePaymentRate(
        payments.paid ?? 0,
        paymentTotal
      ),
    },

    health: {
      revenue: determineRevenueHealth(
        collectionRate,
        payments.overdue ?? 0
      ),
      pipeline:
        totalLeads === 0
          ? "critical"
          : leadCounts.proposal / totalLeads >= 0.25
          ? "healthy"
          : leadCounts.proposal / totalLeads >= 0.1
          ? "warning"
          : "critical",
    },
  };
}

/* Legacy helpers retained for compatibility */

export function calculateGrowth(
  current: number,
  previous: number
) {
  if (!previous) return 100;

  return ((current - previous) / previous) * 100;
}

export { calculateConversion, calculatePaymentRate };