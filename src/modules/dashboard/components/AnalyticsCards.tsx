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
  description?: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function KPICard({
  title,
  value,
  subtitle,
  color = "text-white",
  description,
}: CardProps) {
  return (
    <div
      className="
        group
        relative
        min-h-[170px]
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-slate-900/70
        p-5
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-amber-300/40
        hover:bg-slate-900
        hover:shadow-xl
      "
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className="
            text-xs
            font-bold
            uppercase
            tracking-wide
            leading-5
            text-slate-400
          "
        >
          {title}
        </p>

        <span
          className="
            h-2
            w-2
            shrink-0
            rounded-full
            bg-amber-300/70
          "
        />
      </div>

      <h3
        className={`
          mt-5
          text-4xl
          font-black
          tracking-tight
          ${color}
        `}
      >
        {value}
      </h3>

      {subtitle && (
        <p
          className="
            mt-3
            text-sm
            leading-relaxed
            text-slate-400
          "
        >
          {subtitle}
        </p>
      )}

      {description && (
        <div
          className="
            pointer-events-none
            absolute
            inset-x-4
            bottom-4
            rounded-xl
            border
            border-amber-300/20
            bg-slate-950/95
            px-3
            py-3
            text-xs
            leading-relaxed
            text-slate-200
            opacity-0
            transition-all
            duration-200
            group-hover:opacity-100
          "
        >
          {description}
        </div>
      )}
    </div>
  );
}

export default function AnalyticsCards({ data }: Props) {
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
      subtitle: "Converted successfully",
      color: "text-emerald-400",
    },
    {
      title: "Lost Leads",
      value: data.overview.lostLeads,
      subtitle: "Needs analysis",
      color: "text-rose-400",
    },
    {
      title: "Conversion Rate",
      value: `${data.overview.conversionRate}%`,
      subtitle: "Lead to client",
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
      value: formatCurrency(data.revenue.totalRevenue),
      subtitle: "Total collections",
      color: "text-emerald-400",
    },
    {
      title: "Outstanding",
      value: formatCurrency(data.revenue.outstandingRevenue),
      subtitle: "Pending collection",
      color: "text-amber-400",
    },
    {
      title: "Forecast",
      value: formatCurrency(data.revenue.projectedRevenue),
      subtitle: "Projected revenue",
      color: "text-violet-400",
    },
  ];

  const paymentCards: CardProps[] = [
    {
      title: "Pending Payments",
      value: data.payments.pending,
      subtitle: "Awaiting customer payment",
      description:
        "Invoices generated but payment has not yet been received.",
      color: "text-amber-400",
    },
    {
      title: "Paid Payments",
      value: data.payments.paid,
      subtitle: "Successfully collected",
      description:
        "Payments completed and revenue recognized.",
      color: "text-emerald-400",
    },
    {
      title: "Overdue Payments",
      value: data.payments.overdue,
      subtitle: "Requires follow-up",
      description:
        "Outstanding invoices crossing payment due date.",
      color: "text-rose-400",
    },
    {
      title: "Cancelled Payments",
      value: data.payments.cancelled,
      subtitle: "Cancelled transactions",
      description:
        "Payments cancelled or removed from active collection.",
      color: "text-slate-300",
    },
  ];

  return (
    <div className="space-y-10">

      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-white">
            Business Overview
          </h2>

          <p className="text-sm text-slate-400">
            Live operational KPIs
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((card) => (
            <KPICard key={card.title} {...card} />
          ))}
        </div>
      </section>


      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-white">
            Revenue Snapshot
          </h2>

          <p className="text-sm text-slate-400">
            Collections and forecast
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {revenueCards.map((card) => (
            <KPICard key={card.title} {...card} />
          ))}
        </div>
      </section>


      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-white">
            Payment Health
          </h2>

          <p className="text-sm text-slate-400">
            Invoice payment lifecycle monitoring
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {paymentCards.map((card) => (
            <KPICard key={card.title} {...card} />
          ))}
        </div>
      </section>

    </div>
  );
}