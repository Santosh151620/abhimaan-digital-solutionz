import type { ReactNode } from "react";

import { AIInsightsPanel } from "@/modules/dashboard/ai";
import NotificationSummary from "@/modules/dashboard/notifications/NotificationSummary";
import LiveActivityTicker from "@/modules/dashboard/live/LiveActivityTicker";

import AnalyticsCards from "@/modules/dashboard/components/AnalyticsCards";
import DashboardLiveRefresh from "@/modules/dashboard/components/DashboardLiveRefresh";
import { BoardSummaryPanel } from "@/modules/dashboard/board-summary";
import { MarketIntelligencePanel } from "@/modules/dashboard/market-intelligence";
import { ExecutiveScorecardPanel } from "@/modules/dashboard/executive-scorecard";
import { CommandCenterPanel } from "@/modules/dashboard/command-center";
import { CEOBriefingPanel } from "@/modules/dashboard/ceo-briefing";
import { DealIntelligencePanel } from "@/modules/dashboard/deal-intelligence";
import { StrategicInsightsPanel } from "@/modules/dashboard/strategic-insights";
import { GoalTrackerPanel } from "@/modules/dashboard/goal-tracker";
import { BusinessHealthPanel } from "@/modules/dashboard/business-health";
import { ExecutiveTimelinePanel } from "@/modules/dashboard/executive-timeline";
import { PredictiveAnalyticsPanel } from "@/modules/dashboard/predictive-analytics";
import { SalesVelocityPanel } from "@/modules/dashboard/sales-velocity";
import { CustomerSuccessPanel } from "@/modules/dashboard/customer-success";
import { RevenueIntelligencePanel } from "@/modules/dashboard/revenue-intelligence";
import { KPITrendsPanel } from "@/modules/dashboard/kpi-trends";
import { ExecutiveMetricsPanel } from "@/modules/dashboard/executive";
import { InsightsPanel } from "@/modules/dashboard/insights";
import { AutomationPanel } from "@/modules/dashboard/automation";
import { RiskAlertsPanel } from "@/modules/dashboard/risk-alerts";
import { AISummaryPanel } from "@/modules/dashboard/ai-summary";
import { AIScorePanel } from "@/modules/dashboard/ai-score";
import { QuickActionsPanel } from "@/modules/dashboard/quick-actions";
import { RecentLeadsPanel } from "@/modules/dashboard/recent-leads";
import { TeamPerformancePanel } from "@/modules/dashboard/team-performance";

import NotificationCenter from "@/modules/dashboard/notifications/NotificationCenter";
import ActivityFeed from "@/modules/dashboard/activity/ActivityFeed";
import LiveStatus from "@/modules/dashboard/live/LiveStatus";

import ExecutiveSummaryCard from "@/modules/dashboard/components/ExecutiveSummaryCard";
import PipelineIntelligenceCard from "@/modules/dashboard/components/PipelineIntelligenceCard";
import CRMHealthCard from "@/modules/dashboard/components/CRMHealthCard";
import ActionCenterCard from "@/modules/dashboard/components/ActionCenterCard";
import PriorityAlertsCard from "@/modules/dashboard/components/PriorityAlertsCard";

import { getDashboardSnapshot } from "@/services/dashboard";

import ExecutivePanel from "@/modules/crm/dashboard/components/ExecutivePanel";
import PipelineOverview from "@/modules/crm/dashboard/components/PipelineOverview";
import RevenueForecast from "@/modules/crm/dashboard/components/RevenueForecast";
import RevenueKPI from "@/modules/crm/dashboard/components/RevenueKPI";
import SalesCopilot from "@/modules/crm/dashboard/components/SalesCopilot";
import TodayWorkPanel from "@/modules/crm/dashboard/components/TodayWorkPanel";

function DashboardFrame({
  title,
  description,
  children,
  defaultOpen = true,
}: {
  title: string;
  description: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-xl shadow-black/10 backdrop-blur-xl"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-white/[0.025] sm:px-5 sm:py-5">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight text-white sm:text-base">
            {title}
          </h2>

          <p className="mt-1 max-w-3xl text-xs leading-relaxed text-slate-400 sm:text-sm">
            {description}
          </p>
        </div>

        <span
          aria-hidden="true"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] text-xs text-slate-400 transition-transform duration-200 group-open:rotate-180"
        >
          ↓
        </span>
      </summary>

      <div className="border-t border-slate-800/80 p-3 sm:p-5">
        {children}
      </div>
    </details>
  );
}

export default async function DashboardPage() {
  const dashboard = await getDashboardSnapshot();

  const overview = dashboard.metrics.overview;
  const payments = dashboard.metrics.payments;

  return (
    <main className="crm-page min-w-0 space-y-4 overflow-x-hidden bg-slate-950 px-3 py-4 text-white sm:space-y-5 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
      {/* Primary dashboard identity */}
      <section className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/[0.12] via-blue-500/[0.06] to-slate-900/80 p-5 shadow-2xl shadow-cyan-950/20 sm:p-6 lg:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl"
        />

        <div className="relative flex min-w-0 flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 max-w-4xl">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300 sm:text-xs">
              Business Intelligence
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Real-time visibility into sales activity, pipeline health,
              revenue performance, and business opportunities.
            </p>
          </div>

          <div className="relative shrink-0 lg:pb-1">
            <DashboardLiveRefresh />
          </div>
        </div>
      </section>

      {/* Executive intelligence */}
      <DashboardFrame
        title="Executive Overview"
        description="A concise view of business health, strategic signals, leadership insights, and priority actions."
      >
        <div className="space-y-5">
          <CommandCenterPanel />

          <div className="grid min-w-0 gap-4 xl:grid-cols-2">
            <ExecutiveScorecardPanel />
            <BusinessHealthPanel />
          </div>

          <div className="grid min-w-0 gap-4 xl:grid-cols-2">
            <ExecutivePanel executive={dashboard.executive} />
            <ExecutiveMetricsPanel />
          </div>

          <ExecutiveTimelinePanel />

          <div className="grid min-w-0 gap-4 xl:grid-cols-2">
            <CEOBriefingPanel />
            <BoardSummaryPanel />
          </div>

          <PriorityAlertsCard
            metrics={dashboard.metrics}
            workflow={dashboard.workflow}
          />

        </div>
      </DashboardFrame>

      {/* CRM overview */}
      <DashboardFrame
        title="CRM Overview & Performance"
        description="Core customer relationship metrics, pipeline health, sales conversion, and operational performance."
      >
        <div className="space-y-5">
          <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <ExecutiveSummaryCard metrics={dashboard.metrics} />

            <PipelineIntelligenceCard
              metrics={{
                totalLeads: overview.totalLeads,
                qualifiedLeads: overview.qualifiedLeads,
                proposalLeads: overview.proposalLeads,
                wonLeads: overview.wonLeads,
                conversionRate: overview.conversionRate,
              }}
            />

            <CRMHealthCard metrics={dashboard.metrics} />

            <ActionCenterCard
              metrics={{
                totalLeads: overview.totalLeads,
                newLeads: overview.newLeads,
                qualifiedLeads: overview.qualifiedLeads,
                proposalLeads: overview.proposalLeads,
                overduePayments: payments.overdue,
              }}
            />
          </div>

          <AnalyticsCards data={dashboard.metrics} />

          <div className="grid min-w-0 gap-5 xl:grid-cols-2">
            <PipelineOverview data={dashboard.pipeline} />
            <RevenueKPI data={dashboard.revenue} />
          </div>

          <KPITrendsPanel />
        </div>
      </DashboardFrame>

      {/* Sales and revenue */}
      <DashboardFrame
        title="Sales & Revenue Intelligence"
        description="Revenue performance, forecasting, deal intelligence, and sales execution."
      >
        <div className="space-y-5">
          <RevenueIntelligencePanel />

          <div className="grid min-w-0 gap-5 xl:grid-cols-2">
            <SalesVelocityPanel />
            <DealIntelligencePanel />
          </div>

          <SalesCopilot data={dashboard.copilot} />

          <div className="grid min-w-0 gap-5 xl:grid-cols-2">
            <PredictiveAnalyticsPanel />
            <StrategicInsightsPanel />
          </div>

          <RevenueForecast {...dashboard.forecast} />
        </div>
      </DashboardFrame>

      {/* Today's work */}
      <DashboardFrame
        title="Today's Work"
        description="Recommended follow-ups, sales actions, and operational priorities for today."
      >
        <TodayWorkPanel items={dashboard.today} />
      </DashboardFrame>

      {/* Customer and operations */}
      <DashboardFrame
        title="Customer & Operations"
        description="Customer success, goals, tasks, recent activity, and team performance."
        defaultOpen={false}
      >
        <div className="space-y-5">
          <div className="grid min-w-0 gap-5 xl:grid-cols-2">
            <CustomerSuccessPanel />
            <GoalTrackerPanel />
          </div>

          <QuickActionsPanel />

          <div className="grid min-w-0 gap-5 xl:grid-cols-2">
            <RecentLeadsPanel />
            <TeamPerformancePanel />
          </div>
        </div>
      </DashboardFrame>

      {/* Market intelligence */}
      <DashboardFrame
        title="Market Intelligence"
        description="External signals and market context supporting business decisions."
        defaultOpen={false}
      >
        <MarketIntelligencePanel />
      </DashboardFrame>

      {/* AI intelligence */}
      <DashboardFrame
        title="AI Intelligence"
        description="AI business scoring, executive summaries, recommendations, and risk intelligence."
        defaultOpen={false}
      >
        <div className="grid min-w-0 gap-5 xl:grid-cols-3">
          <AIScorePanel />
          <AISummaryPanel />
          <RiskAlertsPanel />
        </div>

        <div className="mt-5">
          <AIInsightsPanel />
        </div>
      </DashboardFrame>

      {/* Activity and notifications */}
      <DashboardFrame
        title="Activity & Notifications"
        description="Live system activity, notifications, automation, and operational events."
        defaultOpen={false}
      >
        <div className="space-y-5">
          <div className="grid min-w-0 gap-5 xl:grid-cols-3">
            <NotificationCenter />
            <ActivityFeed />
            <LiveStatus />
          </div>

          <div className="grid min-w-0 gap-5 xl:grid-cols-3">
            <NotificationSummary />
            <LiveActivityTicker />
            <AutomationPanel />
          </div>

          <InsightsPanel />
        </div>
      </DashboardFrame>

      {/* Platform status */}
      <section className="rounded-2xl border border-emerald-500/20 bg-slate-900/70 p-4 shadow-xl shadow-black/10 sm:p-5">
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
            Platform Status
          </p>

          <h2 className="mt-1 text-sm font-semibold text-white">
            Business Platform Services
          </h2>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Business Intelligence",
            "Executive Intelligence",
            "Revenue Forecast Engine",
            "Workflow Intelligence",
            "Dashboard Analytics",
            "Production Services",
          ].map((service) => (
            <div
              key={service}
              className="flex min-w-0 items-center gap-2 rounded-xl border border-white/5 bg-white/[0.025] px-3 py-2.5"
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.45)]"
              />

              <span className="truncate text-xs text-slate-300">
                {service}
              </span>

              <span className="ml-auto shrink-0 text-[10px] font-medium text-emerald-400">
                Ready
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
