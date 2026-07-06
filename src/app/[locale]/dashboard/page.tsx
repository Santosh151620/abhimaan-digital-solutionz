import AnalyticsCards from "@/modules/dashboard/components/AnalyticsCards";

import { getDashboardSnapshot } from "@/services/dashboard";

import ExecutivePanel from "./components/crm/ExecutivePanel";
import PipelineOverview from "./components/crm/PipelineOverview";
import RevenueForecast from "./components/crm/RevenueForecast";
import RevenueKPI from "./components/crm/RevenueKPI";
import SalesCopilot from "./components/crm/SalesCopilot";
import TodayWorkPanel from "./components/crm/TodayWorkPanel";

export default async function DashboardPage() {
  const dashboard = await getDashboardSnapshot();

  return (
    <main className="min-h-screen space-y-8 bg-slate-950 p-6 text-white">

      <ExecutivePanel executive={dashboard.executive} />

      <AnalyticsCards data={dashboard.metrics} />

      
      <RevenueKPI data={dashboard.revenue} />

      <PipelineOverview data={dashboard.pipeline} />

      <SalesCopilot data={dashboard.copilot} />

      <TodayWorkPanel items={dashboard.today} />

      <RevenueForecast {...dashboard.forecast} />

      <section className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-5">
        <h3 className="mb-3 text-sm font-semibold text-emerald-400">
          System Status
        </h3>

        <div className="grid gap-2 text-sm text-slate-300 md:grid-cols-2">
          <p>✓ CRM Intelligence</p>
          <p>✓ Executive Intelligence</p>
          <p>✓ Revenue Forecast Engine</p>
          <p>✓ Workflow Intelligence</p>
          <p>✓ Dashboard Analytics</p>
          <p>✓ Production Services</p>
        </div>
      </section>

    </main>
  );
}