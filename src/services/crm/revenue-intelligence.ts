import {
  getOutstandingRevenue,
  getPaymentsCountByStatus,
  getTotalRevenue,
} from "@/services/payments";
import { getProjectRevenue } from "@/services/projects";

export type RevenueHealth =
  | "excellent"
  | "good"
  | "warning"
  | "critical";

export interface RevenueSnapshot {
  totalRevenue: number;
  outstandingRevenue: number;
  projectedRevenue: number;

  collectionRate: number;

  paidPayments: number;
  pendingPayments: number;
  overduePayments: number;
  cancelledPayments: number;

  health: RevenueHealth;
  summary: string;
}

function calculateCollectionRate(
  totalRevenue: number,
  outstandingRevenue: number
): number {
  if (totalRevenue <= 0) return 0;

  return Math.round(
    ((totalRevenue - outstandingRevenue) / totalRevenue) * 100
  );
}

function determineRevenueHealth(
  collectionRate: number,
  overduePayments: number
): RevenueHealth {
  if (overduePayments >= 10) return "critical";
  if (collectionRate >= 90) return "excellent";
  if (collectionRate >= 75) return "good";
  if (collectionRate >= 50) return "warning";

  return "critical";
}

function buildSummary(
  health: RevenueHealth,
  collectionRate: number,
  outstandingRevenue: number
): string {
  switch (health) {
    case "excellent":
      return `Revenue collection is excellent (${collectionRate}%).`;

    case "good":
      return `Revenue collection is healthy (${collectionRate}%).`;

    case "warning":
      return `Outstanding revenue of ₹${outstandingRevenue.toLocaleString()} requires attention.`;

    case "critical":
      return `Cash flow is at risk. Outstanding revenue is ₹${outstandingRevenue.toLocaleString()}.`;

    default:
      return "Revenue performance unavailable.";
  }
}

export async function getRevenueIntelligence(): Promise<RevenueSnapshot> {
  const [
    totalRevenue,
    outstandingRevenue,
    projectedRevenue,
    paymentCounts,
  ] = await Promise.all([
    getTotalRevenue(),
    getOutstandingRevenue(),
    getProjectRevenue(),
    getPaymentsCountByStatus(),
  ]);

  const safeTotalRevenue = totalRevenue ?? 0;
  const safeOutstandingRevenue = outstandingRevenue ?? 0;
  const safeProjectedRevenue = projectedRevenue ?? 0;

  const paidPayments = paymentCounts?.paid ?? 0;
  const pendingPayments = paymentCounts?.pending ?? 0;
  const overduePayments = paymentCounts?.overdue ?? 0;
  const cancelledPayments = paymentCounts?.cancelled ?? 0;

  const collectionRate = calculateCollectionRate(
    safeTotalRevenue,
    safeOutstandingRevenue
  );

  const health = determineRevenueHealth(
    collectionRate,
    overduePayments
  );

  return {
    totalRevenue: safeTotalRevenue,
    outstandingRevenue: safeOutstandingRevenue,
    projectedRevenue: safeProjectedRevenue,

    collectionRate,

    paidPayments,
    pendingPayments,
    overduePayments,
    cancelledPayments,

    health,

    summary: buildSummary(
      health,
      collectionRate,
      safeOutstandingRevenue
    ),
  };
}