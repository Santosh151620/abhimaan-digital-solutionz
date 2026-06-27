import { getCRMAnalytics } from "@/services/analytics";
import { getPipelineData } from "./pipeline";
import { getRevenueIntelligence } from "./revenue-intelligence";

export type BusinessMomentum =
  | "growing"
  | "stable"
  | "needs_attention";

export interface ExecutiveAlert {
  id: string;
  title: string;
  severity: "low" | "medium" | "high";
}

export interface ExecutiveAction {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
}

export interface ExecutiveSnapshot {
  generatedAt: string;

  summary: string;

  momentum: BusinessMomentum;

  revenue: Awaited<ReturnType<typeof getRevenueIntelligence>>;

  pipeline: Awaited<ReturnType<typeof getPipelineData>>;

  alerts: ExecutiveAlert[];

  actions: ExecutiveAction[];
}

function determineMomentum(
  revenueHealth: Awaited<
    ReturnType<typeof getRevenueIntelligence>
  >["health"],
  pipelineHealth: Awaited<
    ReturnType<typeof getPipelineData>
  >["pipelineHealth"]
): BusinessMomentum {
  if (
    revenueHealth === "excellent" &&
    pipelineHealth === "healthy"
  ) {
    return "growing";
  }

  if (
    revenueHealth === "critical" ||
    pipelineHealth === "critical"
  ) {
    return "needs_attention";
  }

  return "stable";
}

function buildAlerts(
  analytics: Awaited<ReturnType<typeof getCRMAnalytics>>,
  pipeline: Awaited<ReturnType<typeof getPipelineData>>
): ExecutiveAlert[] {
  const alerts: ExecutiveAlert[] = [];

  if (analytics.payments.overdue > 0) {
    alerts.push({
      id: "overdue-payments",
      title: `${analytics.payments.overdue} overdue payment(s) require attention.`,
      severity:
        analytics.payments.overdue >= 5
          ? "high"
          : "medium",
    });
  }

  if (
    analytics.revenue.collectionRate < 75
  ) {
    alerts.push({
      id: "collection-rate",
      title: `Collection rate is ${analytics.revenue.collectionRate}%.`,
      severity:
        analytics.revenue.collectionRate < 50
          ? "high"
          : "medium",
    });
  }

  if (
    pipeline.pipelineHealth === "critical"
  ) {
    alerts.push({
      id: "pipeline-health",
      title:
        "Sales pipeline requires immediate attention.",
      severity: "high",
    });
  }

  if (
    pipeline.bottleneckStage &&
    pipeline.totals[pipeline.bottleneckStage] >= 10
  ) {
    alerts.push({
      id: "pipeline-bottleneck",
      title: `Backlog detected in "${pipeline.bottleneckStage}" stage.`,
      severity: "medium",
    });
  }

  return alerts;
}

function buildActions(
  analytics: Awaited<ReturnType<typeof getCRMAnalytics>>,
  pipeline: Awaited<ReturnType<typeof getPipelineData>>,
  alerts: ExecutiveAlert[]
): ExecutiveAction[] {
  const actions: ExecutiveAction[] = [];

  if (analytics.payments.overdue > 0) {
    actions.push({
      id: "follow-up-payments",
      title: "Follow up overdue payments.",
      priority:
        analytics.payments.overdue >= 5
          ? "high"
          : "medium",
    });
  }

  if (
    analytics.revenue.collectionRate < 75
  ) {
    actions.push({
      id: "improve-collections",
      title:
        "Improve revenue collection performance.",
      priority:
        analytics.revenue.collectionRate < 50
          ? "high"
          : "medium",
    });
  }

  if (
    pipeline.totals.proposal > 0
  ) {
    actions.push({
      id: "proposal-followup",
      title: `Review ${pipeline.totals.proposal} proposal(s).`,
      priority: "high",
    });
  }

  if (
    pipeline.bottleneckStage
  ) {
    actions.push({
      id: "pipeline-review",
      title: `Review ${pipeline.bottleneckStage} stage.`,
      priority:
        pipeline.pipelineHealth === "critical"
          ? "high"
          : "medium",
    });
  }

  if (
    alerts.some(
      (a) => a.severity === "high"
    )
  ) {
    actions.push({
      id: "resolve-critical",
      title:
        "Resolve all critical business alerts today.",
      priority: "high",
    });
  }

  if (actions.length === 0) {
    actions.push({
      id: "maintain",
      title:
        "Business is healthy. Continue monitoring KPIs.",
      priority: "low",
    });
  }

  const order = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return actions.sort(
    (a, b) =>
      order[a.priority] -
      order[b.priority]
  );
}

function buildSummary(
  momentum: BusinessMomentum,
  revenueSummary: string,
  bottleneck: string | null
) {
  switch (momentum) {
    case "growing":
      return `${revenueSummary} Pipeline performance is healthy.`;

    case "stable":
      return bottleneck
        ? `${revenueSummary} Review ${bottleneck} stage.`
        : revenueSummary;

    case "needs_attention":
      return bottleneck
        ? `Immediate attention required. Pipeline slowing in ${bottleneck}.`
        : "Business performance requires attention.";

    default:
      return revenueSummary;
  }
}

export async function getExecutiveIntelligence(): Promise<ExecutiveSnapshot> {
  const [
    analytics,
    revenue,
    pipeline,
  ] = await Promise.all([
    getCRMAnalytics(),
    getRevenueIntelligence(),
    getPipelineData(),
  ]);

  const momentum = determineMomentum(
    revenue.health,
    pipeline.pipelineHealth
  );

  const alerts = buildAlerts(
    analytics,
    pipeline
  );

  const actions = buildActions(
    analytics,
    pipeline,
    alerts
  );

  return {
    generatedAt: new Date().toISOString(),

    summary: buildSummary(
      momentum,
      revenue.summary,
      pipeline.bottleneckStage
    ),

    momentum,

    revenue,

    pipeline,

    alerts,

    actions,
  };
}