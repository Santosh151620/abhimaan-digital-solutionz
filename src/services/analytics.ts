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
  };

  payments: {
    pending: number;
    paid: number;
    overdue: number;
    cancelled: number;
  };
}

export async function getCRMAnalytics(): Promise<CRMAnalytics> {
  const [
    leadCounts,
    activeClients,
    activeProjects,
    projectRevenue,
    totalRevenue,
    outstandingRevenue,
    paymentStatus,
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

  const conversionRate =
    totalLeads === 0
      ? 0
      : Number(((wonLeads / totalLeads) * 100).toFixed(1));

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

      activeClients: activeClients ?? 0,

      activeProjects: activeProjects ?? 0,
    },

    revenue: {
      totalRevenue: totalRevenue ?? 0,
      outstandingRevenue: outstandingRevenue ?? 0,
      projectedRevenue: projectRevenue ?? 0,
    },

    payments: {
      pending: paymentStatus?.pending ?? 0,
      paid: paymentStatus?.paid ?? 0,
      overdue: paymentStatus?.overdue ?? 0,
      cancelled: paymentStatus?.cancelled ?? 0,
    },
  };
}