import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import type { Lead, LeadStatus } from "@/types/lead";
import {
  calculateLeadScore,
  type LeadWithScore,
} from "./lead-intelligence";

export interface PipelineSnapshot {
  stages: Record<LeadStatus, LeadWithScore[]>;
  totals: Record<LeadStatus, number>;
  bottleneckStage: LeadStatus | null;
  pipelineHealth: "healthy" | "warning" | "critical";
}

const STAGES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
];

function emptyStages(): Record<LeadStatus, LeadWithScore[]> {
  return {
    new: [],
    contacted: [],
    qualified: [],
    proposal: [],
    won: [],
    lost: [],
  };
}

function emptyTotals(): Record<LeadStatus, number> {
  return {
    new: 0,
    contacted: 0,
    qualified: 0,
    proposal: 0,
    won: 0,
    lost: 0,
  };
}

function determinePipelineHealth(
  totals: Record<LeadStatus, number>
): PipelineSnapshot["pipelineHealth"] {
  const active =
    totals.new +
    totals.contacted +
    totals.qualified +
    totals.proposal;

  if (active === 0) {
    return "critical";
  }

  const proposalRatio = totals.proposal / active;

  if (proposalRatio >= 0.25) {
    return "healthy";
  }

  if (proposalRatio >= 0.10) {
    return "warning";
  }

  return "critical";
}

function determineBottleneck(
  totals: Record<LeadStatus, number>
): LeadStatus | null {
  const stages: LeadStatus[] = [
    "new",
    "contacted",
    "qualified",
    "proposal",
  ];

  let bottleneck: LeadStatus | null = null;
  let highest = -1;

  for (const stage of stages) {
    if (totals[stage] > highest) {
      highest = totals[stage];
      bottleneck = stage;
    }
  }

  return highest > 0 ? bottleneck : null;
}

export async function getPipelineData(): Promise<PipelineSnapshot> {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("leads")
    .select(
      `
      id,
      created_at,
      full_name,
      email,
      phone,
      company,
      service_interest,
      message,
      source,
      status,
      client_id
      `
    )
    .order("created_at", {
      ascending: false,
    });

  if (error || !data) {
    return {
      stages: emptyStages(),
      totals: emptyTotals(),
      bottleneckStage: null,
      pipelineHealth: "critical",
    };
  }

  const stages: Record<LeadStatus, LeadWithScore[]> = {
  new: [],
  contacted: [],
  qualified: [],
  proposal: [],
  won: [],
  lost: [],
};

  const totals = emptyTotals();

  for (const lead of (data ?? []) as Lead[]) {
    const scored = calculateLeadScore(lead);

    const stage = scored.status;

    if (stages[stage]) {
  stages[stage].push(scored);
}

    totals[stage]++;
  }

  for (const stage of STAGES) {
    stages[stage].sort((a, b) => b.score - a.score);

    stages[stage] = stages[stage].slice(0, 5);
  }

  return {
    stages,
    totals,
    bottleneckStage: determineBottleneck(totals),
    pipelineHealth: determinePipelineHealth(totals),
  };
}
