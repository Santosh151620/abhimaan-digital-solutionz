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

function Card({
  title,
  value,
  color = "text-white",
}: {
  title: string;
  value: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{title}</p>

      <p className={`mt-2 text-2xl font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}

export default function AnalyticsCards({
  data,
}: Props) {
  const overview = [
    {
      title: "Total Leads",
      value: data.overview.totalLeads,
      color: "text-white",
    },
    {
      title: "Won Leads",
      value: data.overview.wonLeads,
      color: "text-emerald-400",
    },
    {
      title: "Conversion",
      value: `${data.overview.conversionRate}%`,
      color: "text-cyan-400",
    },
    {
      title: "Active Clients",
      value: data.overview.activeClients,
      color: "text-white",
    },
    {
      title: "Projects",
      value: data.overview.activeProjects,
      color: "text-white",
    },
    {
      title: "New Leads",
      value: data.overview.newLeads,
      color: "text-sky-400",
    },
    {
      title: "Qualified",
      value: data.overview.qualifiedLeads,
      color: "text-purple-400",
    },
    {
      title: "Lost Leads",
      value: data.overview.lostLeads,
      color: "text-rose-400",
    },
  ];

  const revenue = [
    {
      title: "Revenue",
      value: `₹${data.revenue.totalRevenue.toLocaleString()}`,
      color: "text-white",
    },
    {
      title: "Outstanding",
      value: `₹${data.revenue.outstandingRevenue.toLocaleString()}`,
      color: "text-amber-400",
    },
    {
      title: "Projected",
      value: `₹${data.revenue.projectedRevenue.toLocaleString()}`,
      color: "text-purple-400",
    },
  ];

  const payments = [
    {
      title: "Pending",
      value: data.payments.pending,
      color: "text-white",
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
    <div className="space-y-8">

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">
          CRM Overview
        </h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {overview.map((card) => (
            <Card key={card.title} {...card} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Revenue
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {revenue.map((card) => (
            <Card key={card.title} {...card} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Payments
        </h2>

        <div className="grid gap-4 md:grid-cols-4">
          {payments.map((card) => (
            <Card key={card.title} {...card} />
          ))}
        </div>
      </section>

    </div>
  );
}