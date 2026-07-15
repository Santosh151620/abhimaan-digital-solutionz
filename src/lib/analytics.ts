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

type PaymentRecord = {
  amount: number | string | null;
  status: string;
  created_at: string;
};

function getCurrentMonthRange(): DateRange {
  const now = new Date();

  return {
    start: new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).toISOString(),

    end: new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    ).toISOString(),
  };
}

/**
 * Optimized Revenue Fetch
 */
export async function getRevenueMetrics(
  range?: DateRange
): Promise<RevenueMetrics> {
  const { data, error } = await supabase
    .from("payments")
    .select("amount, status, created_at")
    .gte(
      "created_at",
      range?.start ?? "1970-01-01"
    )
    .lte(
      "created_at",
      range?.end ?? new Date().toISOString()
    );

  if (error) {
    console.error(
      "Analytics error:",
      error.message
    );

    return {
      totalRevenue: 0,
      monthlyRevenue: 0,
      pendingPayments: 0,
      paidPayments: 0,
    };
  }

  const payments =
    (data as PaymentRecord[] | null) ?? [];

  let totalRevenue = 0;
  let monthlyRevenue = 0;
  let pendingPayments = 0;
  let paidPayments = 0;

  for (const payment of payments) {
    const amount = Number(
      payment.amount ?? 0
    );

    if (payment.status === "paid") {
      totalRevenue += amount;
      paidPayments++;
    }

    if (payment.status === "pending") {
      pendingPayments++;
    }
  }

  if (!range) {
    const { start, end } =
      getCurrentMonthRange();

    const monthStart = new Date(start);
    const monthEnd = new Date(end);

    for (const payment of payments) {
      if (payment.status !== "paid") {
        continue;
      }

      const created = new Date(
        payment.created_at
      );

      if (
        created >= monthStart &&
        created <= monthEnd
      ) {
        monthlyRevenue += Number(
          payment.amount ?? 0
        );
      }
    }
  }

  return {
    totalRevenue,
    monthlyRevenue,
    pendingPayments,
    paidPayments,
  };
}





