import React from "react";

type AnalyticsData = {
  overview: {
    totalLeads: number;
    newLeads: number;
    contactedLeads: number;
    qualifiedLeads: number;
    proposalLeads: number;
    wonLeads: number;
    lostLeads: number;
    conversionRate: number;
    activeClients: number;
    activeProjects: number;
  };

  revenue: {
    totalRevenue: number;
    outstandingRevenue: number;
    projectedRevenue: number;
  };

  payments: {
    pending: number;
    paid: number;
    overdue: number;
    cancelled: number;
  };
};

interface Props {
  data: AnalyticsData;
}

interface CardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  color?: string;
}

function KPICard({
  title,
  value,
  subtitle,
  color = "text-white",
}: CardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition-all duration-200 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-950/30">
      <p className="text-sm font-medium text-slate-400">
        {title}
      </p>

      <h3 className={`mt-2 text-3xl font-bold ${color}`}>
        {value}
      </h3>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function AnalyticsCards({
  data,
}: Props) {
  const overviewCards: CardProps[] = [
    {
      title: "Total Leads",
      value: data.overview.totalLeads,
      subtitle: "Overall pipeline",
    },
    {
      title: "New Leads",
      value: data.overview.newLeads,
      subtitle: "Awaiting qualification",
      color: "text-sky-400",
    },
    {
      title: "Qualified",
      value: data.overview.qualifiedLeads,
      subtitle: "Sales ready",
      color: "text-violet-400",
    },
    {
      title: "Won Leads",
      value: data.overview.wonLeads,
      subtitle: "Successfully converted",
      color: "text-emerald-400",
    },
    {
      title: "Lost Leads",
      value: data.overview.lostLeads,
      subtitle: "Need follow-up analysis",
      color: "text-rose-400",
    },
    {
      title: "Conversion Rate",
      value: `${data.overview.conversionRate}%`,
      subtitle: "Lead ? Client",
      color: "text-cyan-400",
    },
    {
      title: "Active Clients",
      value: data.overview.activeClients,
      subtitle: "Current engagements",
    },
    {
      title: "Running Projects",
      value: data.overview.activeProjects,
      subtitle: "Currently active",
    },
  ];

  const revenueCards: CardProps[] = [
    {
      title: "Revenue Collected",
      value: `?${data.revenue.projectedRevenue.toLocaleString()}`,
      subtitle: "Total collections",
      color: "text-emerald-400",
    },
    {
      title: "Outstanding",
      value: `?${data.revenue.outstandingRevenue.toLocaleString()}`,
      subtitle: "Pending collection",
      color: "text-amber-400",
    },
    {
      title: "Forecast",
      value: `?${data.revenue.totalRevenue.toLocaleString()}`,
      subtitle: "Projected revenue",
      color: "text-violet-400",
    },
  ];

  const paymentCards: CardProps[] = [
    {
      title: "Pending",
      value: data.payments.pending,
      color: "text-amber-400",
    },
    {
      title: "Paid",
      value: data.payments.paid,
      color: "text-emerald-400",
    },
    {
      title: "Overdue",
      value: data.payments.overdue,
      color: "text-rose-400",
    },
    {
      title: "Cancelled",
      value: data.payments.cancelled,
      color: "text-slate-400",
    },
  ];

  return (
    <div className="space-y-10">

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              Business Overview
            </h2>

            <p className="text-sm text-slate-400">
              Live operational KPIs
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((card) => (
            <KPICard
              key={card.title}
              {...card}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-white">
            Revenue Snapshot
          </h2>

          <p className="text-sm text-slate-400">
            Collections & forecast
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {revenueCards.map((card) => (
            <KPICard
              key={card.title}
              {...card}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-white">
            Payment Health
          </h2>

          <p className="text-sm text-slate-400">
            Invoice payment status
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {paymentCards.map((card) => (
            <KPICard
              key={card.title}
              {...card}
            />
          ))}
        </div>
      </section>

    </div>
  );
}






