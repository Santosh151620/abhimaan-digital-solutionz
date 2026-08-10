import { unstable_noStore as noStore } from "next/cache";

import { getCRMAnalytics } from "./analytics";
import { getExecutiveIntelligence } from "@/modules/crm/dashboard/services/executive-intelligence";
import { getRevenueForecast } from "./crm/revenue-forecast";
import { getWorkflowIntelligence } from "./crm/workflow-intelligence";

export async function getDashboardSnapshot() {
  noStore();

  const [
    metrics,
    workflow,
    executive,
    forecast,
  ] = await Promise.all([
    getCRMAnalytics(),
    getWorkflowIntelligence(),
    getExecutiveIntelligence(),
    getRevenueForecast(),
  ]);

  return {
    metrics,
    executive,
    workflow,

    pipeline: workflow.pipeline.stages,
    revenue: workflow.revenue,

    forecast,

    today: workflow.today,
    copilot: workflow.copilot,
  };
}