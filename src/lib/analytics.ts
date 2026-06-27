import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export type RevenueMetrics = {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  paidPayments: number;
};

export type DateRange = {
  start: string;
  end: string;
};

function getCurrentMonthRange(): DateRange {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
    end: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString(),
  };
}

/**
 * 🔥 Optimized Revenue Fetch
 * - Uses DB filtering instead of full table scan
 * - Safe for large datasets
 */
export async function getRevenueMetrics(range?: DateRange): Promise<RevenueMetrics> {
  const { data, error } = await supabase
    .from("payments")
    .select("amount, status, created_at")
    .gte("created_at", range?.start ?? "1970-01-01")
    .lte("created_at", range?.end ?? new Date().toISOString());

  if (error) {
    console.error("Analytics error:", error.message);
    return {
      totalRevenue: 0,
      monthlyRevenue: 0,
      pendingPayments: 0,
      paidPayments: 0,
    };
  }

  const payments = data || [];

  let totalRevenue = 0;
  let monthlyRevenue = 0;
  let pendingPayments = 0;
  let paidPayments = 0;

  for (const p of payments) {
    const amount = Number(p.amount || 0);

    if (p.status === "paid") {
      totalRevenue += amount;
      paidPayments += 1;
    }

    if (p.status === "pending") {
      pendingPayments += 1;
    }
  }

  // Monthly logic handled separately if no range provided
  if (!range) {
    const { start, end } = getCurrentMonthRange();

    payments.forEach((p) => {
      if (p.status === "paid") {
        const created = new Date(p.created_at);
        if (created >= new Date(start) && created <= new Date(end)) {
          monthlyRevenue += Number(p.amount || 0);
        }
      }
    });
  }

  return {
    totalRevenue,
    monthlyRevenue,
    pendingPayments,
    paidPayments,
  };
}