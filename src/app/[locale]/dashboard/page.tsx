
import {
    AIInsightsPanel,
} from "@/modules/dashboard/ai";

import NotificationSummary from "@/modules/dashboard/notifications/NotificationSummary";
import LiveActivityTicker from "@/modules/dashboard/live/LiveActivityTicker";

import DashboardSectionSorter from "@/modules/dashboard/components/DashboardSectionSorter";
import AnalyticsCards from "@/modules/dashboard/components/AnalyticsCards";

import {
    BoardSummaryPanel,
} from "@/modules/dashboard/board-summary";

import {
    MarketIntelligencePanel,
} from "@/modules/dashboard/market-intelligence";

import {
    ExecutiveScorecardPanel,
} from "@/modules/dashboard/executive-scorecard";

import {
    CommandCenterPanel,
} from "@/modules/dashboard/command-center";

import {
    CEOBriefingPanel,
} from "@/modules/dashboard/ceo-briefing";

import {
    DealIntelligencePanel,
} from "@/modules/dashboard/deal-intelligence";

import {
    StrategicInsightsPanel,
} from "@/modules/dashboard/strategic-insights";

import {
    GoalTrackerPanel,
} from "@/modules/dashboard/goal-tracker";

import {
    BusinessHealthPanel,
} from "@/modules/dashboard/business-health";

import {
    ExecutiveTimelinePanel,
} from "@/modules/dashboard/executive-timeline";

import {
    PredictiveAnalyticsPanel,
} from "@/modules/dashboard/predictive-analytics";

import {
    SalesVelocityPanel,
} from "@/modules/dashboard/sales-velocity";

import {
    CustomerSuccessPanel,
} from "@/modules/dashboard/customer-success";

import {
    RevenueIntelligencePanel,
} from "@/modules/dashboard/revenue-intelligence";

import {
    KPITrendsPanel,
} from "@/modules/dashboard/kpi-trends";

import {
    ExecutiveMetricsPanel,
} from "@/modules/dashboard/executive";

import {
    InsightsPanel,
} from "@/modules/dashboard/insights";

import {
    AutomationPanel,
} from "@/modules/dashboard/automation";

import {
    RiskAlertsPanel,
} from "@/modules/dashboard/risk-alerts";

import {
    AISummaryPanel,
} from "@/modules/dashboard/ai-summary";

import {
    AIScorePanel,
} from "@/modules/dashboard/ai-score";

import {
    QuickActionsPanel,
} from "@/modules/dashboard/quick-actions";

import {
    RecentLeadsPanel,
} from "@/modules/dashboard/recent-leads";

import {
    TeamPerformancePanel,
} from "@/modules/dashboard/team-performance";


import NotificationCenter from "@/modules/dashboard/notifications/NotificationCenter";
import ActivityFeed from "@/modules/dashboard/activity/ActivityFeed";
import LiveStatus from "@/modules/dashboard/live/LiveStatus";


import ExecutiveSummaryCard from "@/modules/dashboard/components/ExecutiveSummaryCard";
import PipelineIntelligenceCard from "@/modules/dashboard/components/PipelineIntelligenceCard";
import CRMHealthCard from "@/modules/dashboard/components/CRMHealthCard";
import ActionCenterCard from "@/modules/dashboard/components/ActionCenterCard";
import PriorityAlertsCard from "@/modules/dashboard/components/PriorityAlertsCard";


import {
    getDashboardSnapshot,
} from "@/services/dashboard";


import ExecutivePanel from "@/modules/crm/dashboard/components/ExecutivePanel";
import PipelineOverview from "@/modules/crm/dashboard/components/PipelineOverview";
import RevenueForecast from "@/modules/crm/dashboard/components/RevenueForecast";
import RevenueKPI from "@/modules/crm/dashboard/components/RevenueKPI";
import SalesCopilot from "@/modules/crm/dashboard/components/SalesCopilot";
import TodayWorkPanel from "@/modules/crm/dashboard/components/TodayWorkPanel";



export default async function DashboardPage() {


    const dashboard =
        await getDashboardSnapshot();



    const overview =
        dashboard.metrics.overview;


    const payments =
        dashboard.metrics.payments;



    const sections = [

        {
            id:"executive-overview",

            title:"Executive Overview",

            description:
                "Business health, strategic signals and leadership insights.",


            content:(

                <div className="space-y-5">

                    <CommandCenterPanel />


                    <div className="grid gap-5 xl:grid-cols-2">

                        <ExecutiveScorecardPanel />

                        <BusinessHealthPanel />

                    </div>


                    <div className="grid gap-5 xl:grid-cols-2">

                        <ExecutivePanel
                            executive={
                                dashboard.executive
                            }
                        />

                        <ExecutiveMetricsPanel />

                    </div>


                    <ExecutiveTimelinePanel />


                    <div className="grid gap-5 xl:grid-cols-2">

                        <CEOBriefingPanel />

                        <BoardSummaryPanel />

                    </div>


                    <PriorityAlertsCard
                        metrics={
                            dashboard.metrics
                        }
                        workflow={
                            dashboard.workflow
                        }
                    />


                </div>

            ),
        },


        {
            id:"crm-performance",

            title:"CRM Overview & Performance",

            description:
                "Customer relationships, pipeline performance and operational KPIs.",


            content:(

                <div className="space-y-5">


                    <ExecutiveSummaryCard
                        metrics={
                            dashboard.metrics
                        }
                    />



                    <div className="grid gap-5 xl:grid-cols-3">

                        <PipelineIntelligenceCard
                            metrics={{
                                totalLeads:
                                    overview.totalLeads,

                                qualifiedLeads:
                                    overview.qualifiedLeads,

                                proposalLeads:
                                    overview.proposalLeads,

                                wonLeads:
                                    overview.wonLeads,

                                conversionRate:
                                    overview.conversionRate,
                            }}
                        />


                        <CRMHealthCard
                            metrics={
                                dashboard.metrics
                            }
                        />


                        <ActionCenterCard
                            metrics={{
                                totalLeads:
                                    overview.totalLeads,

                                newLeads:
                                    overview.newLeads,

                                qualifiedLeads:
                                    overview.qualifiedLeads,

                                proposalLeads:
                                    overview.proposalLeads,

                                overduePayments:
                                    payments.overdue,
                            }}
                        />

                    </div>


                    <AnalyticsCards
                        data={
                            dashboard.metrics
                        }
                    />


                    <div className="grid gap-5 xl:grid-cols-2">

                        <PipelineOverview
                            data={
                                dashboard.pipeline
                            }
                        />


                        <RevenueKPI
                            data={
                                dashboard.revenue
                            }
                        />

                    </div>


                    <KPITrendsPanel />

                </div>

            ),
        },


        {
            id:"sales-revenue",

            title:"Sales & Revenue Intelligence",

            description:
                "Revenue performance, forecasting, deal intelligence and execution.",


            content:(

                <div className="space-y-5">

                    <RevenueIntelligencePanel />


                    <div className="grid gap-5 xl:grid-cols-2">

                        <SalesVelocityPanel />

                        <DealIntelligencePanel />

                    </div>


                    <SalesCopilot
                        data={
                            dashboard.copilot
                        }
                    />


                    <div className="grid gap-5 xl:grid-cols-2">

                        <PredictiveAnalyticsPanel />

                        <StrategicInsightsPanel />

                    </div>


                    <RevenueForecast
                        {...dashboard.forecast}
                    />

                </div>

            ),
        },


        {
            id:"today-work",

            title:"Today's Work",

            description:
                "Recommended follow-ups and operational priorities.",


            content:(

                <TodayWorkPanel
                    items={
                        dashboard.today
                    }
                />

            ),
        },



        {
            id:"operations",

            title:"Customer & Operations",

            description:
                "Customer success, goals and team activity.",


            content:(

                <div className="space-y-5">

                    <div className="grid gap-5 xl:grid-cols-2">

                        <CustomerSuccessPanel />

                        <GoalTrackerPanel />

                    </div>


                    <QuickActionsPanel />


                    <div className="grid gap-5 xl:grid-cols-2">

                        <RecentLeadsPanel />

                        <TeamPerformancePanel />

                    </div>

                </div>

            ),
        },


        {
            id:"market",

            title:"Market Intelligence",

            description:
                "Market signals and business intelligence.",


            content:(
                <MarketIntelligencePanel />
            ),
        },


        {
            id:"ai",

            title:"AI Intelligence",

            description:
                "AI insights, scoring and predictive signals.",


            content:(

                <div className="space-y-5">

                    <div className="grid gap-5 xl:grid-cols-3">

                        <AIScorePanel />

                        <AISummaryPanel />

                        <RiskAlertsPanel />

                    </div>


                    <AIInsightsPanel />

                </div>

            ),
        },


        {
            id:"activity",

            title:"Activity & Notifications",

            description:
                "Notifications, live status and automation.",


            content:(

                <div className="space-y-5">


                    <div className="grid gap-5 xl:grid-cols-3">

                        <NotificationCenter />

                        <ActivityFeed />

                        <LiveStatus />

                    </div>


                    <div className="grid gap-5 xl:grid-cols-3">

                        <NotificationSummary />

                        <LiveActivityTicker />

                        <AutomationPanel />

                    </div>


                    <InsightsPanel />

                </div>

            ),
        },

    ];



    return (

        <main
            className="
                min-w-0
                space-y-5
                overflow-x-hidden
                bg-slate-950
                px-3
                py-4
                text-white
                sm:px-5
                lg:px-6
            "
        >


            <section
                className="
                    rounded-2xl
                    border
                    border-cyan-400/20
                    bg-gradient-to-br
                    from-cyan-500/[0.12]
                    via-blue-500/[0.06]
                    to-slate-900/80
                    p-6
                "
            >

                <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
                    Business Intelligence
                </p>


                <h1 className="mt-2 text-3xl font-bold">
                    Dashboard
                </h1>


                <p className="mt-2 text-slate-300">
                    Real-time visibility into sales activity,
                    pipeline health and revenue performance.
                </p>


            </section>



            <DashboardSectionSorter
                sections={
                    sections
                }
            />


        </main>

    );

}
