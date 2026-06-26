"use client";

import { useMemo, useState } from "react";
import LeadCard from "./LeadCard";

type Lead = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  service_interest: string | null;
  message: string | null;
  status: string | null;
  created_at: string;
};

const STATUS_OPTIONS = [
  "All",
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Won",
  "Lost",
];

export default function LeadsDashboard({
  leads,
}: {
  leads: Lead[];
}) {
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredLeads = useMemo(() => {
    if (statusFilter === "All") return leads;

    return leads.filter(
      (lead) => (lead.status || "New") === statusFilter
    );
  }, [leads, statusFilter]);

  const totalLeads = leads.length;

  const newLeads = leads.filter(
    (lead) => (lead.status || "New") === "New"
  ).length;

  const wonLeads = leads.filter(
    (lead) => lead.status === "Won"
  ).length;

  const lostLeads = leads.filter(
    (lead) => lead.status === "Lost"
  ).length;

  const groupedCompanies = filteredLeads.reduce(
    (acc, lead) => {
      const company = lead.company?.trim() || "Independent";

      if (!acc[company]) {
        acc[company] = [];
      }

      acc[company].push(lead);

      return acc;
    },
    {} as Record<string, Lead[]>
  );

  const companyNames = Object.keys(groupedCompanies).sort();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Total Leads" value={totalLeads} />
        <MetricCard title="New Leads" value={newLeads} />
        <MetricCard title="Won Leads" value={wonLeads} />
        <MetricCard title="Lost Leads" value={lostLeads} />
      </div>

      <div className="flex items-center gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <div className="text-slate-400 text-sm">
          Showing {filteredLeads.length} lead(s)
        </div>
      </div>

      {companyNames.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
          No leads found.
        </div>
      )}

      {companyNames.map((company) => (
        <section key={company} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {company}
            </h2>

            <span className="text-sm text-slate-400">
              {groupedCompanies[company].length} Lead(s)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groupedCompanies[company].map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <p className="text-slate-400 text-sm">{title}</p>

      <h3 className="text-3xl font-bold text-white mt-2">
        {value}
      </h3>
    </div>
  );
}