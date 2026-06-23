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

const STATUS_FILTERS = [
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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const searchTerm = search.toLowerCase();

      const matchesSearch =
        (lead.full_name || "").toLowerCase().includes(searchTerm) ||
        (lead.email || "").toLowerCase().includes(searchTerm) ||
        (lead.company || "").toLowerCase().includes(searchTerm) ||
        (lead.service_interest || "").toLowerCase().includes(searchTerm);

      const currentStatus = lead.status || "New";

      const matchesStatus =
        statusFilter === "All"
          ? true
          : currentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  return (
    <>
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search by name, email, company or service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white"
        />

        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                statusFilter === status
                  ? "bg-teal-600 text-white"
                  : "bg-slate-900 border border-slate-800 text-slate-400"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 text-sm text-slate-400">
        Showing{" "}
        <span className="text-teal-400 font-semibold">
          {filteredLeads.length}
        </span>{" "}
        leads
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredLeads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </>
  );
}