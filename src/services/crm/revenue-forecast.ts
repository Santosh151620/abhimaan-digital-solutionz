import { createClient } from "@/lib/supabase/client";

export interface RevenueForecast {
  estimatedMonthlyRevenue: number;
  pipelineValue: number;
  winProbability: number;
  averageDealSize: number;
  velocityScore: number;
}

const EMPTY_FORECAST: RevenueForecast = {
  estimatedMonthlyRevenue: 0,
  pipelineValue: 0,
  winProbability: 0,
  averageDealSize: 0,
  velocityScore: 0,
};

/**
 * Lightweight revenue forecast engine.
 *
 * This is intentionally deterministic business math.
 * It does not use AI or predictive external services.
 */
export async function getRevenueForecast(): Promise<RevenueForecast> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("leads")
    .select("id, status, created_at, amount");

  if (error || !data || data.length === 0) {
    return EMPTY_FORECAST;
  }

  let totalValue = 0;
  let wonValue = 0;
  let wonCount = 0;
  let activePipelineValue = 0;
  let activeLeads = 0;

  for (const lead of data) {
    const amount =
      typeof lead.amount === "number"
        ? lead.amount
        : Number(lead.amount) || 0;

    totalValue += amount;

    if (lead.status === "won") {
      wonValue += amount;
      wonCount++;
      continue;
    }

    if (lead.status !== "lost") {
      activeLeads++;
      activePipelineValue += amount;
    }
  }

  const leadCount = data.length;

  const averageDealSize =
    totalValue / leadCount;

  const winProbability =
    (wonCount / leadCount) * 100;

  const pipelineValue =
    activePipelineValue;

  const velocityScore =
    activeLeads * 10;

  const estimatedMonthlyRevenue =
    wonValue +
    pipelineValue *
      (winProbability / 100);

  return {
    estimatedMonthlyRevenue,
    pipelineValue,
    winProbability,
    averageDealSize,
    velocityScore,
  };
}
