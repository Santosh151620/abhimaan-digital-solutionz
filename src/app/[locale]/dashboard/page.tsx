import AnalyticsCards from "@/modules/dashboard/components/AnalyticsCards";

import ExecutiveSummaryCard from "@/modules/dashboard/components/ExecutiveSummaryCard";
import PipelineIntelligenceCard from "@/modules/dashboard/components/PipelineIntelligenceCard";
import CRMHealthCard from "@/modules/dashboard/components/CRMHealthCard";
import ActionCenterCard from "@/modules/dashboard/components/ActionCenterCard";
import DashboardEmptyState from "@/modules/dashboard/components/DashboardEmptyState";
<DashboardEmptyState />
import { getDashboardSnapshot } from "@/services/dashboard";

import ExecutivePanel from "./components/crm/ExecutivePanel";
import PipelineOverview from "./components/crm/PipelineOverviewLegacy";
import RevenueForecast from "./components/crm/RevenueForecast";
import RevenueKPI from "./components/crm/RevenueKPI";
import SalesCopilot from "./components/crm/SalesCopilot";
import TodayWorkPanel from "./components/crm/TodayWorkPanel";

export default async function DashboardPage() {
  const dashboard = await getDashboardSnapshot();

  return (
    <main className="min-h-screen space-y-6 sm:space-y-8 bg-slate-950 px-4 py-5 text-white sm:p-6">

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
        <h1 className="text-xl font-bold sm:text-2xl">
          CRM Intelligence Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Real-time visibility into sales activity, pipeline health, and opportunities.
        </p>
      </section>

      <ExecutivePanel executive={dashboard.executive} />

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ExecutiveSummaryCard />
        <PipelineIntelligenceCard />
        <CRMHealthCard />
        <ActionCenterCard />
      </div>

      <AnalyticsCards data={dashboard.metrics} />

      <RevenueKPI data={dashboard.revenue} />

      <PipelineOverview data={dashboard.pipeline} />

      <SalesCopilot data={dashboard.copilot} />

      <TodayWorkPanel items={dashboard.today} />

      <RevenueForecast {...dashboard.forecast} />

      <section className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-6">
        <h3 className="mb-3 text-sm font-semibold text-emerald-400">
          System Status
        </h3>

        <div className="grid gap-2 text-sm text-slate-300 md:grid-cols-2">
          <p>âœ“ CRM Intelligence</p>
          <p>âœ“ Executive Intelligence</p>
          <p>âœ“ Revenue Forecast Engine</p>
          <p>âœ“ Workflow Intelligence</p>
          <p>âœ“ Dashboard Analytics</p>
          <p>âœ“ Production Services</p>
        </div>
      </section>

    </main>
  );
}

