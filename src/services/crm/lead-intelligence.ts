import type { Lead } from "@/types/lead";

export type LeadPriority = "hot" | "warm" | "cold";

export interface LeadWithScore extends Lead {
  score: number;
  priority: LeadPriority;
  ageInDays: number;
}

const DAY_IN_MS = 1000 * 60 * 60 * 24;

/**
 * Returns the age of a lead in whole days.
 */
export function getLeadAgeInDays(createdAt: string): number {
  return Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / DAY_IN_MS
  );
}

/**
 * Returns a deterministic business score for a lead.
 * The score is intentionally lightweight and explainable.
 */
export function calculateLeadScore(lead: Lead): LeadWithScore {
  let score = 0;

  const ageInDays = getLeadAgeInDays(lead.created_at);

  // ------------------------------------------------------------------
  // Freshness
  // ------------------------------------------------------------------

  if (ageInDays <= 2) score += 40;
  else if (ageInDays <= 7) score += 25;
  else if (ageInDays <= 30) score += 10;

  // ------------------------------------------------------------------
  // Pipeline Stage
  // ------------------------------------------------------------------

  switch (lead.status) {
    case "new":
      score += 30;
      break;

    case "contacted":
      score += 50;
      break;

    case "qualified":
      score += 65;
      break;

    case "proposal":
      score += 80;
      break;

    case "won":
      score += 100;
      break;

    case "lost":
      score += 0;
      break;

    default:
      score += 20;
  }

  // ------------------------------------------------------------------
  // Company leads generally have higher value
  // ------------------------------------------------------------------

  if (lead.company?.trim()) {
    score += 10;
  }

  // ------------------------------------------------------------------
  // Professional email heuristic
  // ------------------------------------------------------------------

  if (lead.email.endsWith(".com")) {
    score += 10;
  }

  // ------------------------------------------------------------------
  // Contact completeness
  // ------------------------------------------------------------------

  if (lead.phone) score += 5;

  if (lead.service_interest) score += 10;

  // ------------------------------------------------------------------
  // Priority Classification
  // ------------------------------------------------------------------

  let priority: LeadPriority = "cold";

  if (score >= 120) {
    priority = "hot";
  } else if (score >= 70) {
    priority = "warm";
  }

  return {
    ...lead,
    ageInDays,
    score,
    priority,
  };
}

/**
 * Filters leads that require immediate attention.
 */
export function getActionableLeads(
  leads: readonly Lead[]
): LeadWithScore[] {
  return leads
    .map(calculateLeadScore)
    .filter(
      (lead) =>
        lead.priority === "hot" &&
        lead.status !== "won" &&
        lead.status !== "lost"
    )
    .sort((a, b) => b.score - a.score);
}

/**
 * Returns inactive leads based on age.
 */
export function getInactiveLeads(leads: Lead[] = []): LeadWithScore[] {
  if (!Array.isArray(leads)) {
    return [];
  }
  return leads
    .filter(Boolean)
    .map((lead) => {
      try {
        return calculateLeadScore(lead);
      } catch {
        
  const fallback: LeadWithScore = {
  ...lead,
  score: 0,
  priority: "cold",
  ageInDays: getLeadAgeInDays(lead.created_at),
};

return fallback;
      }
    })
    .filter((lead) => lead.status !== "won");
}

/**
 * Executive summary of lead priorities.
 */
export function summarizeLeadHealth(
  leads: readonly Lead[]
) {
  const scored = leads.map(calculateLeadScore);

  return {
    total: scored.length,

    hot: scored.filter((l) => l.priority === "hot").length,

    warm: scored.filter((l) => l.priority === "warm").length,

    cold: scored.filter((l) => l.priority === "cold").length,

    averageScore:
      scored.length === 0
        ? 0
        : Math.round(
          scored.reduce(
            (total, lead) => total + lead.score,
            0
          ) / scored.length
        ),
  };
}





