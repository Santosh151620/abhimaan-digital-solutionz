import { getCRMAnalytics } from "./analytics";
import { getExecutiveIntelligence } from "@/modules/crm/dashboard/services/executive-intelligence";
import { getRevenueForecast } from "./crm/revenue-forecast";
import { getWorkflowIntelligence } from "./crm/workflow-intelligence";

// KEEP EVERYTHING ELSE IN THIS FILE EXACTLY AS IT IS.

export async function getDashboardSnapshot() {

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





