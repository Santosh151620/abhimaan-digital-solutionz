"use client";

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
  subtitle,
  color = "text-white",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/40 p-5">
      <p className="text-sm text-slate-400">{title}</p>

      <p className={`text-2xl font-bold ${color}`}>
        {value}
      </p>

      {subtitle && (
        <p className="text-xs text-slate-500 mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function AnalyticsCards({ data }: Props) {
  return (
    <div className="space-y-6">

      {/* OVERVIEW */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">
          CRM Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <Card
            title="Total Leads"
            value={data.overview.totalLeads}
            color="text-white"
          />

          <Card
            title="Won Leads"
            value={data.overview.wonLeads}
            color="text-emerald-400"
          />

          <Card
            title="Conversion Rate"
            value={`${data.overview.conversionRate}%`}
            color="text-cyan-400"
          />

          <Card
            title="Active Clients"
            value={data.overview.activeClients}
            color="text-white"
          />

          <Card
            title="Active Projects"
            value={data.overview.activeProjects}
            color="text-white"
          />

          <Card
            title="New Leads"
            value={data.overview.newLeads}
            color="text-sky-400"
          />

          <Card
            title="Qualified Leads"
            value={data.overview.qualifiedLeads}
            color="text-purple-400"
          />

          <Card
            title="Lost Leads"
            value={data.overview.lostLeads}
            color="text-rose-400"
          />

        </div>
      </div>

      {/* REVENUE */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">
          Revenue
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <Card
            title="Total Revenue"
            value={`₹${data.revenue.totalRevenue}`}
            color="text-white"
          />

          <Card
            title="Outstanding"
            value={`₹${data.revenue.outstandingRevenue}`}
            color="text-amber-400"
          />

          <Card
            title="Projected"
            value={`₹${data.revenue.projectedRevenue}`}
            color="text-purple-400"
          />

        </div>
      </div>

      {/* PAYMENTS */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">
          Payments
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <Card
            title="Pending"
            value={data.payments.pending}
            color="text-white"
          />

          <Card
            title="Paid"
            value={data.payments.paid}
            color="text-emerald-400"
          />

          <Card
            title="Overdue"
            value={data.payments.overdue}
            color="text-rose-400"
          />

          <Card
            title="Cancelled"
            value={data.payments.cancelled}
            color="text-slate-400"
          />

        </div>
      </div>

    </div>
  );
}