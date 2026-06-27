import { createClient } from "@/lib/supabase/client";
import { calculateLeadScore } from "./lead-intelligence";

const supabase = createClient();

export interface RevenueForecast {
  estimatedMonthlyRevenue: number;
  pipelineValue: number;
  winProbability: number;
  averageDealSize: number;
  velocityScore: number;
}

/**
 * 🔮 Lightweight Revenue Forecast Engine
 * (No AI, just smart business math)
 */
export async function getRevenueForecast(): Promise<RevenueForecast> {
  const { data, error } = await supabase
    .from("leads")
    .select("id, status, created_at, amount");

  if (error || !data) {
    return {
      estimatedMonthlyRevenue: 0,
      pipelineValue: 0,
      winProbability: 0,
      averageDealSize: 0,
      velocityScore: 0,
    };
  }

  let totalValue = 0;
  let wonValue = 0;
  let wonCount = 0;
  let activeLeads = 0;

  const now = Date.now();

  for (const lead of data) {
    const enriched = calculateLeadScore(lead);

    const amount = lead.amount || 0;

    totalValue += amount;

    // WON DEALS
    if (lead.status === "won") {
      wonValue += amount;
      wonCount++;
    }

    // ACTIVE PIPELINE
    if (lead.status !== "won" && lead.status !== "lost") {
      activeLeads++;
    }
  }

  const averageDealSize = totalValue / (data.length || 1);

  // WIN PROBABILITY (simple ratio model)
  const winProbability =
    (wonCount / (data.length || 1)) * 100;

  // PIPELINE VALUE (active deals weighted)
  const pipelineValue = totalValue * 0.6;

  // VELOCITY (how active your funnel is)
  const velocityScore = activeLeads * 10;

  // MONTHLY FORECAST (simple projection)
  const estimatedMonthlyRevenue =
    wonValue + pipelineValue * (winProbability / 100);

  return {
    estimatedMonthlyRevenue,
    pipelineValue,
    winProbability,
    averageDealSize,
    velocityScore,
  };
}