import { getCRMAnalytics } from "./analytics";
import { getExecutiveIntelligence } from "./crm/executive-intelligence";
import { getRevenueForecast } from "./crm/revenue-forecast";
import { getWorkflowIntelligence } from "./crm/workflow-intelligence";

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





